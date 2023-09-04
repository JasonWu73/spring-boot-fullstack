package net.wuxianjie.springbootdemo.redis;

import cn.hutool.core.lang.Console;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Set;

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

    // smembers colors:1
    Set<String> colors1 = redisTemplate.opsForSet().members("colors:1");
    Console.log("smembers colors:1 --> {}", colors1);

    // sunion colors:1 colors:2 colors:3
    Set<String> union = redisTemplate.opsForSet().union(List.of("colors:1", "colors:2", "colors:3"));
    Console.log("sunion colors:1 colors:2 colors:3 --> {}", union);

    // sinter colors:1 colors:2 colors:3
    Set<String> intersect = redisTemplate.opsForSet().intersect(List.of("colors:1", "colors:2", "colors:3"));
    Console.log("intersect colors:1 colors:2 colors:3 --> {}", intersect);

    // sdiff colors:1 colors:2 colors:3
    Set<String> difference = redisTemplate.opsForSet().difference(List.of("colors:2", "colors:1", "colors:3"));
    Console.log("sdiff colors:2 colors:1 colors:3 --> {}", difference);

    // sinterstore colors:inter colors:1 colors:2 colors:3
    addedNum = redisTemplate.opsForSet().intersectAndStore(List.of("colors:1", "colors:2", "colors:3"), "colors:inter");
    Console.log("sinterstore colors:inter colors:1 colors:2 colors:3 --> {}", addedNum);
  }
}
