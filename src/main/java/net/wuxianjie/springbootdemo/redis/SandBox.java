package net.wuxianjie.springbootdemo.redis;

import cn.hutool.core.thread.ThreadUtil;
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
    ThreadUtil.execAsync(this::usingTransaction);
    ThreadUtil.execAsync(this::usingTransaction);
  }

private void usingTransaction() {
  synchronized (this) {
    redisTemplate.watch("list");

    boolean isEmpty = isEmpty();
    if (!isEmpty) {
      return;
    }

    redisTemplate.multi();

    addItem();

    redisTemplate.exec();
  }
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