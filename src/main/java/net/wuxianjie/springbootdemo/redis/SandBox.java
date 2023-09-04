package net.wuxianjie.springbootdemo.redis;

import cn.hutool.core.lang.Console;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.data.redis.core.Cursor;
import org.springframework.data.redis.core.ScanOptions;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class SandBox implements CommandLineRunner {

  private final StringRedisTemplate redisTemplate;

  @Override
  public void run(String... args) {
    // sadd colors:1 red blue orange
    Long addedNum = redisTemplate.opsForSet().add("colors:1", "red", "blue", "orange");
    Console.log("sadd colors:1 red blue orange --> {}", addedNum);

    // sadd colors:2 red green purple
    addedNum = redisTemplate.opsForSet().add("colors:2", "red", "green", "purple");
    Console.log("sadd colors:2 red green purple --> {}", addedNum);

    // sadd colors:3 red orange blue
    addedNum = redisTemplate.opsForSet().add("colors:3", "red", "orange", "blue");
    Console.log("sadd colors:3 red orange blue --> {}", addedNum);

    // sscan colors:1 0 count 2
    try (
      Cursor<String> cursor = redisTemplate.opsForSet().scan("colors:1", ScanOptions.scanOptions().count(2).build())
    ) {
      List<String> results = new ArrayList<>();
      int count = 0;
      while (cursor.hasNext() && count < 2) {
        results.add(cursor.next());
        count++;
      }
      Console.log("sscan colors:1 {} count 2 --> {}", cursor.getCursorId(), results);
    }

    // srem colors:1 blue
    Long removedNum = redisTemplate.opsForSet().remove("colors:1", "blue");
    Console.log("srem colors:1 blue --> {}", removedNum);

    // scard colors:1
    Long size = redisTemplate.opsForSet().size("colors:1");
    Console.log("scard colors:1 --> {}", size);
  }
}
