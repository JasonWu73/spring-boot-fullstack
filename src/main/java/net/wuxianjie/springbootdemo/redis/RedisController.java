package net.wuxianjie.springbootdemo.redis;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@Slf4j
@RestController
@RequiredArgsConstructor
public class RedisController implements CommandLineRunner {

  private final RedisTemplate<String, String> redisTemplate;

  @Override
  public void run(String... args) throws InterruptedException {
    Map<String, String> keyMaps = Map.of("color", "red", "car", "toyota");
    redisTemplate.opsForValue().multiSet(keyMaps);

    List<String> values = redisTemplate.opsForValue().multiGet(List.of("color", "car"));
    log.info("[color={}, car={}]", values.get(0), values.get(1));
  }
}
