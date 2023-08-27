package net.wuxianjie.springbootdemo.redis;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.web.bind.annotation.RestController;

import java.util.concurrent.TimeUnit;

@Slf4j
@RestController
@RequiredArgsConstructor
public class RedisController implements CommandLineRunner {

  private final RedisTemplate<String, String> redisTemplate;

  @Override
  public void run(String... args) throws InterruptedException {
    redisTemplate.opsForValue().set("color", "red", 2, TimeUnit.SECONDS);
    String color = redisTemplate.opsForValue().get("color");
    log.info("color: {}", color);

    TimeUnit.SECONDS.sleep(2);
    color = redisTemplate.opsForValue().get("color");
    log.info("color after 2 seconds: {}", color);
  }
}
