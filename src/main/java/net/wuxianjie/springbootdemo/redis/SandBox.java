package net.wuxianjie.springbootdemo.redis;

import cn.hutool.core.lang.Console;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.data.redis.connection.StringRedisConnection;
import org.springframework.data.redis.core.RedisCallback;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Component
@RequiredArgsConstructor
public class SandBox implements CommandLineRunner {

  private final StringRedisTemplate redisTemplate;
  private final ObjectMapper objectMapper;

  @Override
  public void run(String... args) {
    // 用户 id 为 1 所有喜欢商品的商品 id
    List<String> productIds = getLikedProductsId();

    // 获取所有商品列表
    List<Product> products = getLikedProducts(productIds);
    Console.log("喜欢的商品：{}", products);
  }

  private List<Product> getLikedProducts(List<String> productIds) {
    List<Object> products = redisTemplate.executePipelined((RedisCallback<?>) connection -> {
      StringRedisConnection conn = (StringRedisConnection) connection;
      productIds.forEach(s -> conn.hGetAll("products:" + s));
      return null;
    });

    List<Product> productList = new ArrayList<>();
    for (int i = 0; i < products.size(); i++) {
      String id = productIds.get(i);
      Object item = products.get(i);

      if (item == null) {
        productList.add(new Product(id, null, 0));
        continue;
      }

      Product product = objectMapper.convertValue(item, Product.class);

      productList.add(new Product(id, product.name(), product.likes()));
    }

    return productList;
  }

  private List<String> getLikedProductsId() {
    return Objects.requireNonNull(redisTemplate.opsForSet().members("users:2")).stream().toList();
  }
}

record Product(String id, String name, int likes) {}
