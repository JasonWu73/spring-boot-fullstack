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
    // 创建假用户数据
    generateFakeUserData();

    // 创建用户名与 id 对应的有序集合
    generateUsernameToUserIdSortedSet();

    // 模拟登录：通过用户名获取用户 id
    String username = "吴仙杰";
    long userId = getUserIdFromCache(username);

    // 获取用户数据
    getUserData(userId);
  }

  private void getUserData(long userId) {
    Map<Object, Object> userMap = redisTemplate.opsForHash().entries(getUserKey(userId));

    User user = objectMapper.convertValue(userMap, User.class);

    Console.log("登录用户: ", user);
  }

  private long getUserIdFromCache(String username) {
    Double userId = redisTemplate.opsForZSet().score("usernames", username);
    if (userId == null) {
      throw new IllegalArgumentException("用户未登录");
    }

    return userId.longValue();
  }

  private void generateUsernameToUserIdSortedSet() {
    redisTemplate.opsForZSet().add("usernames", "吴仙杰", 1);
  }

  private void generateFakeUserData() {
    addUserData(List.of(
      new User(1L, "吴仙杰", 25),
      new User(2L, "Bruce", 18),
      new User(3L, "Jason", 30)
    ));
  }

  private void addUserData(List<User> users) {
    redisTemplate.executePipelined((RedisCallback<?>) connection -> {
      StringRedisConnection conn = (StringRedisConnection) connection;

      users.forEach(user -> {
        String key = getUserKey(user.id());
        Map<String, String> data = objectMapper.convertValue(user, new TypeReference<>() {});

        conn.hMSet(key, data);
      });

      return null;
    });
  }

  private String getUserKey(Long id) {
    return "users:" + id;
  }

}

record User(Long id, String username, int age) {}