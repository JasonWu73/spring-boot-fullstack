package net.wuxianjie.backend.shared.redis;

import java.util.Objects;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

/**
 * 基于 Redis 的分布式锁实现。
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class RedisLock {

  private static final int LOCK_TIMEOUT_SECONDS = 30;
  private static final int LOCK_CHECK_SECONDS = LOCK_TIMEOUT_SECONDS - 5;

  private final StringRedisTemplate stringRedisTemplate;

  // 存储每个锁的自动续期标志
  private final ConcurrentHashMap<String, Boolean> renew = new ConcurrentHashMap<>();

  /**
   * 上锁，支持对锁的自动续期。
   *
   * @param key 锁的键
   * @param value 锁的值
   * @return 是否上锁成功
   */
  public boolean lock(final String key, final String value) {
    final Boolean locked = stringRedisTemplate
      .opsForValue()
      .setIfAbsent(key, value, LOCK_TIMEOUT_SECONDS, TimeUnit.SECONDS);
    if (locked == null || !locked) return false;

    // 开启自动续期
    renewLock(key, value);
    return true;
  }

  /**
   * 解锁。
   *
   * @param key 锁的键
   * @param value 锁的值
   */
  public void unlock(final String key, final String value) {
    final String currentValue = stringRedisTemplate.opsForValue().get(key);
    if (!Objects.equals(currentValue, value)) return;
    stringRedisTemplate.delete(key);

    // 停止自动续期
    renew.remove(key);
  }

  private void renewLock(final String lockedKey, final String lockedValue) {
    renew.put(lockedKey, true);

    new Thread(() -> {
      while (renew.getOrDefault(lockedKey, false)) {
        final String currentValue = stringRedisTemplate.opsForValue().get(lockedKey);
        if (!Objects.equals(currentValue, lockedValue)) break;

        // 续期
        stringRedisTemplate.expire(lockedKey, LOCK_TIMEOUT_SECONDS, TimeUnit.SECONDS);

        try {
          TimeUnit.SECONDS.sleep(LOCK_CHECK_SECONDS);
        } catch (InterruptedException ignore) {
          log.warn("Redis 分布式锁自动续期: 休眠异常");
        }
      }
    }).start();
  }
}
