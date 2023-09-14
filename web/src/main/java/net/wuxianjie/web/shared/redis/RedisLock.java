package net.wuxianjie.web.shared.redis;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicBoolean;

@Slf4j
@Component
@RequiredArgsConstructor
public class RedisLock {

  private static final int LOCK_TIMEOUT_SECS = 30;

  private final StringRedisTemplate stringRedisTemplate;

  // 存储每个锁的自动续期标志
  private final Map<String, AtomicBoolean> renewFlags = new ConcurrentHashMap<>();

  /**
   * 上锁。
   *
   * <p>当一个方法获取了 Lock 但执行时间超过了 Lock 的超时时间（Timeout），
   * 这种情况下，Lock 会自动释放，这可能会导致其他线程或实例获取该 Lock，从而引发数据不一致的问题。
   * 故该方法支持对 Lock 自动续期。
   *
   * @param key 锁的键
   * @param value 锁的值
   * @return 是否上锁成功
   */
  public boolean lock(String key, String value) {
    // 上锁
    Boolean isLocked = stringRedisTemplate.opsForValue().setIfAbsent(key, value, LOCK_TIMEOUT_SECS, TimeUnit.SECONDS);
    if (isLocked == null || !isLocked) {
      return false;
    }

    // 上锁成功，开启 Lock 自动续期线程
    startRenewLockThread(key, value);

    return true;
  }

  /**
   * 解锁。
   *
   * @param key 锁的键
   * @param value 锁的值
   */
  public void unlock(String key, String value) {
    // 解锁
    String currentValue = stringRedisTemplate.opsForValue().get(key);
    if (currentValue == null || !currentValue.equals(value)) {
      return;
    }

    stringRedisTemplate.delete(key);

    // 停止 Lock 自动续期线程
    stopRenewLockThread(key);
  }

  private void startRenewLockThread(String key, String value) {
    renewFlags.put(key, new AtomicBoolean(true)); // 初始化 renewFlag
    renewLock(key, value);
  }

  private void stopRenewLockThread(String key) {
    AtomicBoolean flag = renewFlags.get(key);
    if (flag != null) {
      flag.set(false); // 停止 renewThread 线程
    }
    renewFlags.remove(key); // 移除 renewFlag
  }

  public void renewLock(String key, String value) {
    // 获取 renewFlag
    AtomicBoolean renewFlag = renewFlags.get(key);
    if (renewFlag == null) {
      return;
    }

    // 启动一个单独的线程或定时任务来负责 Lock 的续期。这个线程会在 Lock 快到期时，对 Lock 进行续期
    new Thread(() -> {
      // 使用标志变量控制线程
      while (renewFlag.get()) {
        // 若非当前锁的持有者，则直接退出线程
        String currentValue = stringRedisTemplate.opsForValue().get(key);
        if (currentValue == null || !currentValue.equals(value)) {
          break;
        }

        // Lock 续期
        stringRedisTemplate.expire(key, LOCK_TIMEOUT_SECS, TimeUnit.SECONDS);

        // 休眠以等待下一次续期
        try {
          TimeUnit.SECONDS.sleep(LOCK_TIMEOUT_SECS / 2);
        } catch (InterruptedException e) {
          log.warn("Lock 自动续期休眠异常");
        }
      }
    }).start();
  }
}