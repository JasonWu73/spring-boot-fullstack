package net.wuxianjie.springbootdemo.redis;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@Slf4j
@RestController
@RequiredArgsConstructor
public class RedisController implements CommandLineRunner {

  private final RedisTemplate<String, String> redisTemplate;

  @Override
  public void run(String... args) {
    // hset car color red year 1950
    Map<String, String> entries = Map.of("color", "red", "year", "1950");
    redisTemplate.opsForHash().putAll("car", entries);
    log.info("hset car color red year 1950");

    // hget car color red
    String color = (String) redisTemplate.opsForHash().get("car", "color");
    log.info("hget car color red --> {}", color);

    // hgetall car
    Map<Object, Object> car = redisTemplate.opsForHash().entries("car");
    log.info("hgetall car --> {}", car);
  }
}
