package net.wuxianjie.springbootdemo.redis;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.wuxianjie.springbootdemo.redis.dto.CachedSession;
import net.wuxianjie.springbootdemo.redis.dto.CachedUser;
import net.wuxianjie.springbootdemo.redis.dto.NewUser;
import net.wuxianjie.springbootdemo.redis.dto.User;
import net.wuxianjie.springbootdemo.shared.exception.ApiException;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;

@Slf4j
@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class UserController {

  private final StringRedisTemplate redisTemplate;
  private final ObjectMapper objectMapper;
  private final SessionController sessionController;

  @GetMapping("/users/{userId}")
  public ResponseEntity<User> getUser(@PathVariable String userId) {
    Optional<User> userOpt = getUserFromRedis(userId);
    if (userOpt.isEmpty()) {
      throw new ApiException(HttpStatus.NOT_FOUND, "用户不存在");
    }

    return ResponseEntity.ok(userOpt.get());
  }

  @PostMapping("/users")
  public ResponseEntity<LinkedHashMap<String, String>> createUser(@Valid @RequestBody NewUser user) {
    String userId = KeyUtils.getUuid();
    String key = KeyUtils.getUsers(userId);

    checkForUserNotExists(key);

    CachedUser cachedUser = createCachedUser(user);

    saveUser(key, cachedUser);

    printSavedUser(key);

    String sessionId = sessionController.saveSession(new CachedSession(userId, user.username()));

    LinkedHashMap<String, String> data = new LinkedHashMap<>();
    data.put("sessionId", sessionId);

    return ResponseEntity.ok(data);
  }

  private void checkForUserNotExists(String key) {
    Boolean isExisted = redisTemplate.hasKey(key);
    if (Boolean.TRUE.equals(isExisted)) {
      printSavedUser(key);
      throw new ApiException(HttpStatus.CONFLICT, "已存在同名用户");
    }
  }

  private void saveUser(String key, CachedUser user) {
    Map<String, String> val = objectMapper.convertValue(user, new TypeReference<>() {});
    val.put("createdAt", String.valueOf(user.createdAt().toInstant(ZoneOffset.ofHours(8)).toEpochMilli()));
    redisTemplate.opsForHash().putAll(key, val);
  }

  private CachedUser createCachedUser(NewUser user) {
    return new CachedUser(user.username(), user.password(), LocalDateTime.now());
  }

  private void printSavedUser(String key) {
    Map<Object, Object> val = redisTemplate.opsForHash().entries(key);

    CachedUser cachedUser = toCachedUser(val);

    log.info("Data in redis: {}", cachedUser);
  }

  private Optional<User> getUserFromRedis(String userId) {
    String key = KeyUtils.getUsers(userId);
    Map<Object, Object> val = redisTemplate.opsForHash().entries(key);
    if (val.isEmpty()) {
      return Optional.empty();
    }

    CachedUser cachedUser = toCachedUser(val);

    return Optional.of(new User(userId, cachedUser.username(), cachedUser.password(), cachedUser.createdAt()));
  }

  private static CachedUser toCachedUser(Map<Object, Object> val) {
    return new CachedUser(
      (String) val.get("username"),
      (String) val.get("password"),
      Instant.ofEpochMilli(Long.parseLong((String) val.get("createdAt"))).atOffset(ZoneOffset.ofHours(8)).toLocalDateTime()
    );
  }
}
