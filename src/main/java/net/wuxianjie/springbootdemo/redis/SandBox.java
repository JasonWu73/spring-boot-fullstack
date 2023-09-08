package net.wuxianjie.springbootdemo.redis;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SandBox implements CommandLineRunner {

  private final StringRedisTemplate redisTemplate;

  @Override
  public void run(String... args) {
    // 模拟多线程不安全的情况
    new Thread(this::usingTransaction).start();
    new Thread(this::usingTransaction).start();
  }

  private void usingTransaction() {
    Boolean getLock = redisTemplate.opsForValue().setIfAbsent("locks", "1");
    if (Boolean.FALSE.equals(getLock)) {
      System.out.println("进行 [" + Thread.currentThread().getName() + "] 无法获取锁");
      return;
    }

    boolean isEmpty = isEmpty();
    if (!isEmpty) {
      return;
    }

    addItem();

    redisTemplate.delete("locks");
  }

  private void currencyIssue() {
    boolean isEmpty = isEmpty();
    if (!isEmpty) {
      return;
    }

    addItem();
  }

  private void addItem() {
    redisTemplate.opsForList().rightPush("list", "a");
  }

  private boolean isEmpty() {
    Long size = redisTemplate.opsForList().size("list");
    return size == null || size == 0;
  }
}