package net.wuxianjie.springbootdemo.redis;

import cn.hutool.core.thread.ThreadUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class SandBox implements CommandLineRunner {

  private final StringRedisTemplate redisTemplate;

  @Override
  public void run(String... args) {
    // 模拟多线程不安全的情况
    ThreadUtil.execAsync(this::incrementInStockNoConcurrencyIssue);
    ThreadUtil.execAsync(this::incrementInStockNoConcurrencyIssue);
  }

  private void incrementInStockNoConcurrencyIssue() {
    String key = "car:1";
    redisTemplate.opsForHash().increment(key, "inStock", 1);
  }

  private void incrementInStockConcurrencyIssue() {
    String key = "car:1";
    Integer inStock = Optional.ofNullable(redisTemplate.opsForHash().get(key, "inStock"))
      .map(o -> Integer.parseInt(String.valueOf(o)))
      .orElseThrow();

    inStock++;

    redisTemplate.opsForHash().put(key, "inStock", String.valueOf(inStock));
  }
}