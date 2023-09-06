package net.wuxianjie.springbootdemo.redis;

import cn.hutool.core.lang.Console;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.data.redis.connection.StringRedisConnection;
import org.springframework.data.redis.core.RedisCallback;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class SandBox implements CommandLineRunner {

  private final StringRedisTemplate redisTemplate;
  private final ObjectMapper objectMapper;

  @Override
  public void run(String... args) {
    // 模拟商品查看数
    // 商品数据
    List<Product> products = List.of(
      new Product(1L, "iPhone", 0),
      new Product(2L, "iPod", 0),
      new Product(3L, "MacBook", 0)
    );

    // 将商品数据存入 Redis hash
    saveProducts(products);

    // 模拟查看商品存入 Redis zSet
    viewProduct("wxj");

    // 同一用户多次查看一个商品仅算一次
    viewProduct("wxj");

    // 其他用户查看再增加一次
    viewProduct("jason");

    // 查看商品详细
    showProductDetails();
  }

  private void showProductDetails() {
    Product product = new Product(1L, "iPhone", 0);

    Map<Object, Object> entries = redisTemplate.opsForHash().entries("products:" + product.id());
    Console.log("Product Info: {}", entries);
  }

  private void viewProduct(String username) {
    Product product = new Product(1L, "iPhone", 0);

    String key = "views:" + username;

    Double viewedNums = redisTemplate.opsForZSet().score(key, product.id() + "");
    if (viewedNums == null) {
      redisTemplate.opsForZSet().add(key, product.id() + "", 1);
      incrementViews(product.id());
      return;
    }

    if (viewedNums > 0) {
      return;
    }

    redisTemplate.opsForZSet().incrementScore(key, product.id() + "", 1);
  }

  private void incrementViews(long productId) {
    redisTemplate.opsForHash().increment("products:" + productId, "views", 1);
  }

  private void saveProducts(List<Product> products) {
    if (isDataExists(products)) {
      return;
    }

    redisTemplate.executePipelined((RedisCallback<?>) connection -> {
      StringRedisConnection conn = (StringRedisConnection) connection;

      products.forEach(product -> {
        Map<String, String> map = objectMapper.convertValue(product, new TypeReference<>() {});

        conn.hMSet("products:" + product.id(), map);
      });

      return null;
    });
  }

  private boolean isDataExists(List<Product> products) {
    List<Boolean> booleans = isExistsProducts(products);

    for (Object bool : booleans) {
      if (Boolean.TRUE == bool) {
        return true;
      }
    }

    return false;
  }

  private List<Boolean> isExistsProducts(List<Product> products) {
    List<Object> booleans = redisTemplate.executePipelined((RedisCallback<?>) connection -> {
      StringRedisConnection conn = (StringRedisConnection) connection;

      products.forEach(product -> conn.hExists("products:" + product.id(), "views"));

      return null;
    });

    return booleans.stream().map(o -> (Boolean) o).toList();
  }
}

record Product(Long id, String name, int views) {}