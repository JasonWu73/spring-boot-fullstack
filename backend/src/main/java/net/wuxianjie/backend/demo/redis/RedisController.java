package net.wuxianjie.backend.demo.redis;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.wuxianjie.backend.shared.redis.RedisLock;
import net.wuxianjie.backend.shared.util.StrUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.concurrent.TimeUnit;

/**
 * Redis 分布式锁示例。
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/public/redis")
@RequiredArgsConstructor
public class RedisController {

  private static final String LOCK_KEY = "lock:demo";

  private final RedisLock redisLock;

  /**
   * 通过分布式锁执行同步操作。
   */
  @GetMapping("/lock")
  public ResponseEntity<Void> doSyncBiz() {
    new Thread(this::executeSync).start();
    new Thread(this::executeSync).start();
    new Thread(this::executeSync).start();

    return ResponseEntity.noContent().build();
  }

  private void executeSync() {
    System.out.printf("[%s] 准备开始执行业务逻辑%n", Thread.currentThread().getName());

    // 生成锁的唯一值
    final String identifier = StrUtils.generateUuid();

    // 直到获取到锁才能执行
    untilGetLock(identifier);

    // 开始执行业务逻辑
    doBiz(identifier);
  }

  private void untilGetLock(final String identifier) {
    while (!redisLock.lock(LOCK_KEY, identifier)) {
      // 休眠以等待下一次获取锁
      try {
        TimeUnit.MILLISECONDS.sleep(800);
      } catch (InterruptedException ignore) {
        log.warn("获取锁休眠异常");
      }
    }
  }

  private void doBiz(final String identifier) {
    final String threadName = Thread.currentThread().getName();

    System.out.printf("🔐[%s] 获取锁成功%n", threadName);

    try {
      System.out.printf("[%s] 执行业务逻辑%n", threadName);

      delay();

      System.out.printf("[%s] 完成业务逻辑%n", threadName);
    } finally {
      redisLock.unlock(LOCK_KEY, identifier);

      System.out.printf("🔓[%s] 解锁成功%n", threadName);
    }
  }

  private void delay() {
    try {
      // 设置大于 `RedisLock#LOCK_TIMEOUT_SECONDS` 的超时时间，可以验证锁续期逻辑是否正确
      TimeUnit.SECONDS.sleep(40);
    } catch (InterruptedException e) {
      throw new RuntimeException(e);
    }
  }
}
