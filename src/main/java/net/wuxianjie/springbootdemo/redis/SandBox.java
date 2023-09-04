package net.wuxianjie.springbootdemo.redis;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import net.wuxianjie.springbootdemo.redis.dto.User;
import org.springframework.boot.CommandLineRunner;
import org.springframework.data.redis.connection.StringRedisConnection;
import org.springframework.data.redis.core.RedisCallback;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class SandBox implements CommandLineRunner {

  private final StringRedisTemplate redisTemplate;
  private final ObjectMapper objectMapper;

  @Override
  public void run(String... args) {
    insertData();

    List<Object> vals = redisTemplate.executePipelined((RedisCallback<?>) connection -> {
      StringRedisConnection conn = (StringRedisConnection) connection;
      conn.hGetAll("user1");
      conn.hGetAll("user2");
      conn.hGetAll("user3");
      return null;
    });

    vals.forEach(System.out::println);
  }

  private void insertData() {
    User user = new User("001", "张三", "pw111", LocalDateTime.now());
    Map<String, Object> data = objectMapper.convertValue(user, new TypeReference<>() {});
    redisTemplate.opsForHash().putAll("user1", data);

    User user1 = new User("002", "李四", "pw111", LocalDateTime.now());
    Map<String, Object> data1 = objectMapper.convertValue(user1, new TypeReference<>() {});
    redisTemplate.opsForHash().putAll("user2", data1);

    User user2 = new User("003", "王五", "pw111", LocalDateTime.now());
    Map<String, Object> data2 = objectMapper.convertValue(user2, new TypeReference<>() {});
    redisTemplate.opsForHash().putAll("user3", data2);
  }
}
