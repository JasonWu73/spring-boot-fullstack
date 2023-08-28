package net.wuxianjie.springbootdemo.redis;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@Slf4j
@RestController
@RequiredArgsConstructor
public class RedisController implements CommandLineRunner {

  private final RedisTemplate<String, String> redisTemplate;

  @Override
  public void run(String... args) {
//    updatingInTwoStepsCausesErrors();

    updatingInOneStepSuccess();
  }

  private void updatingInTwoStepsCausesErrors() {
    updateUpvote();
    updateUpvote();
  }

  private void updatingInOneStepSuccess() {
    updateUpvoteByIncrement();
    updateUpvoteByIncrement();
  }

  private void updateUpvote() {
    new Thread(() -> {
      String upvote = Optional.ofNullable(redisTemplate.opsForValue().get("upvote")).orElseThrow();

      String updatedUpvote = String.valueOf(Integer.parseInt(upvote) + 1);

      redisTemplate.opsForValue().set("upvote", updatedUpvote);

      log.info("{} - updating upvote", Thread.currentThread().getName());
    }).start();
  }

  private void updateUpvoteByIncrement() {
    new Thread(() -> {
      redisTemplate.opsForValue().increment("upvote");

      log.info("{} - updating upvote", Thread.currentThread().getName());
    }).start();
  }
}
