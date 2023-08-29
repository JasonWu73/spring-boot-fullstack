package net.wuxianjie.springbootdemo.redis;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.Set;

@Slf4j
@RestController
@RequiredArgsConstructor
public class RedisController implements CommandLineRunner {

  private final RedisTemplate<String, String> redisTemplate;

  @Override
  public void run(String... args) {
    // hset user name 'Jason Wu' age '25'
    Map<String, String> user = Map.of("name", "Jason Wu", "age", "25", "amount", "0");
    redisTemplate.opsForHash().putAll("user", user);

    // hincrby user amount 100
    Long amount = redisTemplate.opsForHash().increment("user", "amount", 100);
    log.info("hincrby user amount 100 -> {}", amount);

    // hincrbyfloat user amount 0.1
    double amountFloat = redisTemplate.opsForHash().increment("user", "amount", 0.1);
    log.info("hincrbyfloat user amount 0.1 -> {}", amountFloat);

    // hstrlen user age
    Long ageLen = redisTemplate.opsForHash().lengthOfValue("user", "age");
    log.info("hstrlen user age --> {}", ageLen);

    // hstrlen user fake
    Long fakeLen = redisTemplate.opsForHash().lengthOfValue("user", "fake");
    log.info("hstrlen user fake --> {}", fakeLen);

    // hkeys user
    Set<Object> keys = redisTemplate.opsForHash().keys("user");
    log.info("hkeys user --> {}", keys);

    // hvals user
    List<Object> values = redisTemplate.opsForHash().values("user");
    log.info("hvals user --> {}", values);

    // hgetall user
    Map<Object, Object> userInRedis = redisTemplate.opsForHash().entries("user");
    log.info("hgetall user --> {}", userInRedis);
  }
}
