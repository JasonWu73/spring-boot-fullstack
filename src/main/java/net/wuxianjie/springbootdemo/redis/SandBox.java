package net.wuxianjie.springbootdemo.redis;

import cn.hutool.core.lang.Console;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.data.redis.connection.StringRedisConnection;
import org.springframework.data.redis.core.RedisCallback;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Objects;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class SandBox implements CommandLineRunner {

  private final StringRedisTemplate redisTemplate;
  private final ObjectMapper objectMapper;

  @Override
  public void run(String... args) {
    // 数据
    List<Product> products = List.of(
      new Product("MacBooPro", 60),
      new Product("iPhone", 40),
      new Product("iPod", 20)
    );

    // 填充
    addToRedis(products);

    // zrange products 1 2 rev withscores
    zRangeProducts1_2RevWithScores();

    // zrange products 0 100 byscore limit 1 2 withscores
  }

  private void zRangeProducts1_2RevWithScores() {
    Set<ZSetOperations.TypedTuple<String>> set = redisTemplate.opsForZSet().reverseRangeWithScores("products", 1, 2);
    if (set == null) {
      Console.log("zrange products 1 2 rev withscores ---> null");
      return;
    }

    List<Product> list = set.stream()
      .map(stringTypedTuple -> new Product(stringTypedTuple.getValue(), Objects.requireNonNull(stringTypedTuple.getScore())))
      .toList();
    Console.log("zrange products 1 2 rev withscores ---> {}", list);
  }

  private void addToRedis(List<Product> products) {
    redisTemplate.executePipelined((RedisCallback<?>) c -> {
      StringRedisConnection conn = (StringRedisConnection) c;
      products.forEach(p -> conn.zAdd("products", p.score(), p.name()));
      return null;
    });
  }
}

record Product(String name, double score) {}
