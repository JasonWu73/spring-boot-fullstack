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
    // zadd pencilbox 5 pen
    Boolean add = redisTemplate.opsForZSet().add("pencilbox", "pen", 5);
    Console.log("zadd pencilbox 5 pen --> {}", add);

    // zadd pencilbox 1.5 pencil
    add = redisTemplate.opsForZSet().add("pencilbox", "pencil", 1.5);
    Console.log("zadd pencilbox 1.5 pencil --> {}", add);

    // zadd pencilbox 0.5 eraser
    add = redisTemplate.opsForZSet().add("pencilbox", "eraser", 0.5);
    Console.log("zadd pencilbox 0.5 eraser --> {}", add);

    // zcard pencilbox
    Long num = redisTemplate.opsForZSet().zCard("pencilbox");
    Console.log("zcard pencilbox --> {}", num);

    // zcount pencilbox 0.5 1.5
    Long num1 = redisTemplate.opsForZSet().count("pencilbox", 0.5, 1.5);
    Console.log("zcount pencilbox 0.5 1.5 --> {}", num1);

    // zcount pencilbox (0.5 1.5
    // zcount pencilbox -inf +inf
  }
}
