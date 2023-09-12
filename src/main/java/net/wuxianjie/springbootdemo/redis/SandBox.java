package net.wuxianjie.springbootdemo.redis;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.data.redis.connection.RedisConnection;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.StringRedisConnection;
import org.springframework.data.redis.core.RedisCallback;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class SandBox implements CommandLineRunner {

  public static final String IDX_CARS = "idx:cars";

  private final StringRedisTemplate redisTemplate;
  private final ObjectMapper objectMapper;
  private final RedisConnectionFactory redisConnectionFactory;

  @Override
  public void run(String... args) {
    // ==== 使用 ReadiSearch 执行全文搜索 ====

    // 初始化测试数据
    addTestData();

    // 删除全文搜索索引
    deleteFullTextIndex();

    // 创建全文搜索索引
    createFullTextIndex();

    // 执行全文搜索
    executeFullTextSearch();
  }

  private void addTestData() {
    List<Car> cars = List.of(
      new Car(1L, "BMW 1 系运动轿车", "深空灰", 208900),
      new Car(2L, "BMW 2 系双门轿跑车", "魅惑紫", 302900),
      new Car(3L, "BMW 2 系四门轿跑车", "金属蓝", 272900),
      new Car(4L, "新 BMW 3 系标准轴距版", "black night", 299900)
    );

    redisTemplate.executePipelined((RedisCallback<?>) connection -> {
      StringRedisConnection conn = (StringRedisConnection) connection;

      cars.forEach(car -> {
        Map<String, String> valMap = objectMapper.convertValue(car, new TypeReference<>() {});

        conn.hMSet("cars:" + car.id(), valMap);
      });

      return null;
    });
  }

  private void deleteFullTextIndex() {
    RedisConnection connection = redisConnectionFactory.getConnection();
    byte[] resBytes = (byte[]) connection.execute("FT.DROPINDEX", IDX_CARS.getBytes());
    if (resBytes != null && "OK".equals(new String(resBytes))) {
      System.out.printf("成功删除索引 [%s]%n", IDX_CARS);
    }
  }

  private void createFullTextIndex() {
    RedisConnection connection = redisConnectionFactory.getConnection();
    byte[] resBytes = (byte[]) connection.execute(
      "FT.CREATE", IDX_CARS.getBytes(),
      "ON".getBytes(), "HASH".getBytes(),
      "PREFIX".getBytes(), "1".getBytes(), "cars:".getBytes(),
      "LANGUAGE".getBytes(), "chinese".getBytes(),
      "LANGUAGE_FIELD".getBytes(), "chinese".getBytes(),
      "SCHEMA".getBytes(),
      "name".getBytes(), "TEXT".getBytes(),
      "color".getBytes(), "TAG".getBytes(),
      "price".getBytes(), "NUMERIC".getBytes()
    );

    if (resBytes != null && "OK".equals(new String(resBytes))) {
      System.out.printf("成功创建索引 [%s]%n", IDX_CARS);
    }
  }

  private void executeFullTextSearch() {
    RedisConnection connection = redisConnectionFactory.getConnection();
    // java.lang.UnsupportedOperationException: io.lettuce.core.output.ByteArrayOutput does not support set(long)
    Object execute = connection.execute(
      "FT.SEARCH", IDX_CARS.getBytes(),
      "'@name:(%2系% %轿车%)'".getBytes()
    );
    System.out.printf("全文搜索 [FT.SEARCH]: %s%n", execute);
  }
}

record Car(Long id, String name, String color, double price) {}