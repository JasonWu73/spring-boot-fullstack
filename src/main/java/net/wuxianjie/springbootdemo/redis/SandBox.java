package net.wuxianjie.springbootdemo.redis;

import cn.hutool.core.lang.Console;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SandBox implements CommandLineRunner {

  private final StringRedisTemplate redisTemplate;
  private final ObjectMapper objectMapper;

  @Override
  public void run(String... args) {
    // zadd pencilbox 1 pen
    Boolean add = redisTemplate.opsForZSet().add("pencilbox", "pen", 1);
    Console.log("zadd pencilbox 1 pen --> {}", add);

    // zadd pencilbox 0 box
    add = redisTemplate.opsForZSet().add("pencilbox", "box", 0);
    Console.log("zadd pencilbox 0 box --> {}", add);

    // zadd pencilbox 0.5 eraser
    add = redisTemplate.opsForZSet().add("pencilbox", "eraser", 0.5);
    Console.log("zadd pencilbox 0.5 eraser --> {}", add);

    // zscore pencilbox pen
    Double score = redisTemplate.opsForZSet().score("pencilbox", "pen");
    Console.log("zscore pencilbox pen --> {}", score);

    // zrem pencilbox pen
    Long remove = redisTemplate.opsForZSet().remove("pencilbox", "pen");
    Console.log("zrem pencilbox pen --> {}", remove);

    // zscore pencilbox pen
    score = redisTemplate.opsForZSet().score("pencilbox", "pen");
    Console.log("zscore pencilbox pen --> {}", score);
  }
}
