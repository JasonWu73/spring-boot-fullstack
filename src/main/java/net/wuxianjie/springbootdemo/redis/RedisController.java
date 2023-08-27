package net.wuxianjie.springbootdemo.redis;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequiredArgsConstructor
public class RedisController implements CommandLineRunner {

  private final RedisTemplate<String, String> redisTemplate;

  @Override
  public void run(String... args) {
    redisTemplate.opsForValue().setIfAbsent("color", "hi there");
    String color = redisTemplate.opsForValue().get("color");
    log.info("color: {}", color);
  }
}
