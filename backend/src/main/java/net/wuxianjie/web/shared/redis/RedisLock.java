package net.wuxianjie.web.shared.redis;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.util.Objects;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

/**
 * 基于 Redis 实现的分布式锁。
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class RedisLock {

  private static final int LOCK_TIMEOUT_SECONDS = 30;
  private static final int LOCK_CHECK_SECONDS = LOCK_TIMEOUT_SECONDS - 5;

  private final StringRedisTemplate stringRedisTemplate;

  // 存储每个锁的自动续期标志
  private final ConcurrentHashMap<String, Boolean> renew = new ConcurrentHashMap<>();

  /**
   * 上锁，支持锁自动续期。
   *
   * @param key   锁的键
   * @param value 锁的值
   * @return 是否上锁成功
   */
  public boolean lock(final String key, final String value) {
    // 上锁
    final Boolean locked = stringRedisTemplate
        .opsForValue()
        .setIfAbsent(key, value, LOCK_TIMEOUT_SECONDS, TimeUnit.SECONDS);

    if (locked == null || !locked) return false;

    // 上锁成功，开启锁自动续期线程
    startRenewThread(key, value);

    return true;
  }

  /**
   * 解锁。
   *
   * @param key   锁的键
   * @param value 锁的值
   */
  public void unlock(final String key, final String value) {
    // 解锁
    final String currentValue = stringRedisTemplate.opsForValue().get(key);

    if (!Objects.equals(currentValue, value)) return;

    stringRedisTemplate.delete(key);

    // 停止锁自动续期线程
    renew.remove(key);
  }

  private void startRenewThread(final String key, final String value) {
    // 初始化标志变量
    renew.put(key, true);

    new Thread(() -> {
      // 使用标志变量控制线程
      while (renew.getOrDefault(key, false)) {
        // 若非当前锁的持有者，则直接退出线程
        final String currentValue = stringRedisTemplate.opsForValue().get(key);

        if (!Objects.equals(currentValue, value)) break;

        // 锁续期
        stringRedisTemplate.expire(key, LOCK_TIMEOUT_SECONDS, TimeUnit.SECONDS);

        // 休眠以等待下一次续期检查
        try {
          TimeUnit.SECONDS.sleep(LOCK_CHECK_SECONDS);
        } catch (InterruptedException ignore) {
          log.warn("Redis 分布式锁自动续期: 休眠异常");
        }
      }
    }).start();
  }
}
