package net.wuxianjie.springbootdemo.redis;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.wuxianjie.springbootdemo.shared.exception.ApiException;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

@Slf4j
@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class UserController {

  private final StringRedisTemplate redisTemplate;
  private final ObjectMapper objectMapper;

  @GetMapping("/users/{userId}")
  public ResponseEntity<User> getUser(@PathVariable String userId) {
    Optional<User> userOpt = getUserFromRedis(userId);
    if (userOpt.isEmpty()) {
      throw new ApiException(HttpStatus.NOT_FOUND, "用户不存在");
    }

    return ResponseEntity.ok(userOpt.get());
  }

  @PostMapping("/users")
  public ResponseEntity<Void> createUser(@Valid @RequestBody NewUser user) {
    String userId = KeyUtils.getUuid();
    String key = KeyUtils.getUsers(userId);

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
    return new CachedUser(user.username(), user.password(), LocalDateTime.now());
  }

  private void printSavedUser(String key) {
    Map<Object, Object> entries = redisTemplate.opsForHash().entries(key);
    CachedUser cachedUser = objectMapper.convertValue(entries, CachedUser.class);
    log.info("Data in redis: {}", cachedUser);
  }

  private Optional<User> getUserFromRedis(String userId) {
    String key = KeyUtils.getUsers(userId);
    Map<Object, Object> val = redisTemplate.opsForHash().entries(key);
    if (val.isEmpty()) {
      return Optional.empty();
    }

    CachedUser cachedUser = objectMapper.convertValue(val, CachedUser.class);

    return Optional.of(new User(userId, cachedUser.username(), cachedUser.password(), cachedUser.createAt()));
  }
}

record NewUser (
  @NotBlank(message = "用户名不能为空")
  String username,
  @NotBlank(message = "密码不能为空")
  String password
) {}

record CachedUser (String username, String password, LocalDateTime createAt) {}

record User (String id, String username, String password, LocalDateTime createdAt) {}
