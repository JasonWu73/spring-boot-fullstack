package net.wuxianjie.web.redis;

import java.util.UUID;
import java.util.concurrent.TimeUnit;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.wuxianjie.web.shared.redis.RedisLock;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/v1/redis")
@RequiredArgsConstructor
public class RedisController {

  private static final String LOCK_KEY = "lock:demo";

  private final RedisLock redisLock;

  @GetMapping("/lock")
  public ResponseEntity<Void> sendMessage() {
    new Thread(this::executeSync).start();
    new Thread(this::executeSync).start();
    new Thread(this::executeSync).start();

    return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
  }

  private void executeSync() {
    // 生成锁的唯一值
    final String identifier = UUID.randomUUID().toString();

    // 直到获取到锁才能执行
    untilGetLock(identifier);

    // 开始执行业务逻辑
    doBiz(identifier);
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

  private void untilGetLock(final String identifier) {
    while (!redisLock.lock(LOCK_KEY, identifier)) {
      // 休眠以等待下一次获取锁
      try {
        TimeUnit.MILLISECONDS.sleep(800);
      } catch (InterruptedException e) {
        log.warn("获取锁休眠异常");
      }
    }
  }

  private void delay() {
    try {
      TimeUnit.SECONDS.sleep(50);
    } catch (InterruptedException e) {
      throw new RuntimeException(e);
    }
  }
}
