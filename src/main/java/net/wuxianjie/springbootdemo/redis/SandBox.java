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
    ThreadUtil.execAsync(() -> {
//      haveConcurrencyIssue("black");
      noConcurrencyIssue("black");
    });
    ThreadUtil.execAsync(() -> {
//      haveConcurrencyIssue("blue");
      noConcurrencyIssue("blue");
    });
  }

  private void noConcurrencyIssue(String color) {
    redisTemplate.opsForHash().putIfAbsent("cars:1", "color", color);
  }

  private void haveConcurrencyIssue(String color) {
    redisTemplate.opsForHash().put("cars:1", "color", color);
  }
}