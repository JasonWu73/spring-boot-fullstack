package net.wuxianjie.springbootdemo.redis;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.Optional;

@Slf4j
@RestController
@RequiredArgsConstructor
public class RedisController implements CommandLineRunner {

  private final RedisTemplate<String, String> redisTemplate;

  @Override
  public void run(String... args) {
    // hset user name 'Jason Wu' age '25'
    Map<String, String> user = Map.of("name", "Jason Wu", "age", "25");
    redisTemplate.opsForHash().putAll("user", user);

    // hget user name
    String name = (String) redisTemplate.opsForHash().get("user", "name");
    log.info("hget user name --> {}", name);

    // hget user age
    Integer age = Optional.ofNullable(redisTemplate.opsForHash().get("user", "age"))
      .map(o -> Integer.parseInt((String) o))
      .orElse(null);
    log.info("hget user age --> {}", age);

    // hgetall user
    Map<Object, Object> userInRedis = redisTemplate.opsForHash().entries("user");
    log.info("hgetall user --> {}", userInRedis);

    // hexists user age
    Boolean isAgeExists = redisTemplate.opsForHash().hasKey("user", "age");
    log.info("hexists user age --> {}", isAgeExists);

    // hexists user fake
    Boolean isFakeExists = redisTemplate.opsForHash().hasKey("user", "fake");
    log.info("hexists user fake --> {}", isFakeExists);

    // hdel user age
    Long deletedFields = redisTemplate.opsForHash().delete("user", "age", "name");
    log.info("hdel user age --> {}", deletedFields);

    // hgetall user
    Map<Object, Object> afterUpdatedUserInRedis = redisTemplate.opsForHash().entries("user");
    log.info("hgetall user --> {}", afterUpdatedUserInRedis);
  }
}
