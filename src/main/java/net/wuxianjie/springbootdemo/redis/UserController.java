package net.wuxianjie.springbootdemo.redis;

import cn.hutool.core.lang.Console;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import net.wuxianjie.springbootdemo.shared.exception.ApiException;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class UserController {

  private final StringRedisTemplate redisTemplate;
  private final ObjectMapper objectMapper;

  @PostMapping("/users")
  public ResponseEntity<Void> createUser(@Valid @RequestBody NewUser user) {
    String key = KeyUtils.getUsers(user.username());

    checkForUserNotExists(key);

    CachedUser cachedUser = createCachedUser(user);

    saveUser(key, cachedUser);

    printSavedUser(key);

    return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
  }

  private void checkForUserNotExists(String key) {
    Boolean isExisted = redisTemplate.hasKey(key);
    if (Boolean.TRUE.equals(isExisted)) {
      printSavedUser(key);
      throw new ApiException(HttpStatus.CONFLICT, "已存在同名用户");
    }
  }

  private void saveUser(String key, CachedUser user) {
    Map<String, Object> val = objectMapper.convertValue(user, new TypeReference<>() {});
    redisTemplate.opsForHash().putAll(key, val);
  }

  private CachedUser createCachedUser(NewUser user) {
    return new CachedUser(KeyUtils.getUuid(), user.password(), LocalDateTime.now());
  }

  private void printSavedUser(String key) {
    Map<Object, Object> entries = redisTemplate.opsForHash().entries(key);
    CachedUser cachedUser = objectMapper.convertValue(entries, CachedUser.class);
    Console.log(cachedUser);
  }
}

record NewUser (
  @NotBlank(message = "用户名不能为空")
  String username,
  @NotBlank(message = "密码不能为空")
  String password
) {}

record CachedUser (String id, String password, LocalDateTime createAt) {}
