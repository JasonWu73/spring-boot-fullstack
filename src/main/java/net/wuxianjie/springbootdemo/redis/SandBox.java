package net.wuxianjie.springbootdemo.redis;

import cn.hutool.core.lang.Console;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.stereotype.Component;

import java.util.Set;

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

    // zpopmin pencilbox 2
    Set<ZSetOperations.TypedTuple<String>> min2 = redisTemplate.opsForZSet().popMin("pencilbox", 4);
    if (min2 == null) {
      Console.log("zpopmin pencilbox 2 --> null");
    } else {
      min2.forEach(stringTypedTuple -> {
        String value = stringTypedTuple.getValue();
        Double score = stringTypedTuple.getScore();
        Console.log("zpopmin pencilbox 2 --> {}: {}", value, score);
      });
    }

    // zpopmax pencilbox
    ZSetOperations.TypedTuple<String> max = redisTemplate.opsForZSet().popMax("pencilbox");
    if (max == null) {
      Console.log("zpopmax pencilbox --> null");
    } else {
      String value = max.getValue();
      Double score = max.getScore();
      Console.log("zpopmax pencilbox --> {}: {}", value, score);
    }
  }
}
