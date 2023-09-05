package net.wuxianjie.springbootdemo.redis;

import cn.hutool.core.lang.Console;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.stereotype.Component;

import java.io.Serializable;
import java.util.*;

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

    // zrange pencilbox 1 2 withscores
    Set<ZSetOperations.TypedTuple<String>> pencilbox = redisTemplate.opsForZSet().rangeWithScores("pencilbox", 1, 2);
    if (pencilbox == null) {
      Console.log("zrange pencilbox 1 2 withscores ---> null");
    } else {
      List<LinkedHashMap<String, Object>> list = pencilbox.stream().map(i -> {
          LinkedHashMap<String, Object> map = new LinkedHashMap<>();
          map.put("memember", i.getValue());
          map.put("score", i.getScore());
          return map;
        })
        .toList();
      Console.log("zrange pencilbox 1 2 withscores ---> {}", list);
    }
  }
}
