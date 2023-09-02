package net.wuxianjie.springbootdemo.redis;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import net.wuxianjie.springbootdemo.shared.exception.ApiException;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class SessionController {

  private final StringRedisTemplate redisTemplate;
  private final ObjectMapper objectMapper;

  @GetMapping("/sessions/{sessionId}")
  public ResponseEntity<Session> getSession(@PathVariable String sessionId) {
    Optional<Session> sessionOpt = getSessionFromRedis(sessionId);
    if (sessionOpt.isEmpty()) {
      throw new ApiException(HttpStatus.NOT_FOUND, "未找到登录会话");
    }

    return ResponseEntity.ok(sessionOpt.get());
  }

  private Optional<Session> getSessionFromRedis(String sessionId) {
    String key = KeyUtils.getSessions(sessionId);
    Map<Object, Object> val = redisTemplate.opsForHash().entries(key);
    if (val.isEmpty()) {
      return Optional.empty();
    }

    CachedSession cachedSession = objectMapper.convertValue(val, CachedSession.class);
    return Optional.of(new Session(sessionId, cachedSession.userId(), cachedSession.username()));
  }
}

record CachedSession (String userId, String username) {}

record Session (String id, String userId, String username) {}
