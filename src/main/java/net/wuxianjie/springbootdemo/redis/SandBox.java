package net.wuxianjie.springbootdemo.redis;

import cn.hutool.core.lang.Console;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.data.redis.connection.StringRedisConnection;
import org.springframework.data.redis.core.RedisCallback;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class SandBox implements CommandLineRunner {

  private final StringRedisTemplate redisTemplate;
  private final ObjectMapper objectMapper;

  @Override
  public void run(String... args) {
    // 模拟查找最贵的商品
    // 构造假商品数据
    List<Product> products = List.of(
      new Product(1L, "iPhone", 50),
      new Product(2L, "iPods", 20),
      new Product(3L, "MacBook", 80)
    );

    // 存入商品数据
    saveProducts(products);

    // 存入价格
    saveProductPrices(products);

    // 获取最贵的商品
    Product highestPriceProduct = getHighestPriceProduct();
    Console.log("最贵商品: {}", highestPriceProduct);
  }

  private Product getHighestPriceProduct() {
    Set<ZSetOperations.TypedTuple<String>> set = redisTemplate.opsForZSet().reverseRangeByScoreWithScores("products:price", 0, Long.MAX_VALUE, 0, 1);
    if (set == null) {
      throw new IllegalArgumentException("商品价格缓存不存在");
    }

    ZSetOperations.TypedTuple<String> highestPriceProduct = set.stream().findFirst().orElseThrow();
    long productId = Long.parseLong(Objects.requireNonNull(highestPriceProduct.getValue()));

    return getProductById(productId);
  }

  private Product getProductById(long productId) {
    Map<Object, Object> entries = redisTemplate.opsForHash().entries("products:" + productId);
    return objectMapper.convertValue(entries, Product.class);
  }

  private void saveProductPrices(List<Product> products) {
    redisTemplate.executePipelined((RedisCallback<?>) connection -> {
      StringRedisConnection conn = (StringRedisConnection) connection;

      products.forEach(product -> conn.zAdd("products:price", product.price(), product.id() + ""));

      return null;
    });
  }

  private void saveProducts(List<Product> products) {
    redisTemplate.executePipelined((RedisCallback<?>) connection -> {
      StringRedisConnection conn = (StringRedisConnection) connection;

      products.forEach(product -> {
        Map<String, String> data = objectMapper.convertValue(product, new TypeReference<>() {});

        conn.hMSet("products:" + product.id(), data);
      });

      return null;
    });
  }
}

record Product(Long id, String name, double price) {}