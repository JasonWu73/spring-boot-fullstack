package net.wuxianjie.springbootdemo.redis;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class RedisController implements CommandLineRunner {

  private final RedisTemplate<String, String> redisTemplate;

  @Override
  public void run(String... args) {
    String fullname = redisTemplate.opsForValue().get("fullname");
    System.out.println(fullname);

    redisTemplate.opsForValue().set("realname", "吴仙杰");
    String realname = redisTemplate.opsForValue().get("realname");
    System.out.println(realname);
  }
}
