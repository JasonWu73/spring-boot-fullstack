package net.wuxianjie.web.user;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import net.wuxianjie.web.shared.auth.CachedAuth;
import net.wuxianjie.web.shared.auth.TokenAuth;
import net.wuxianjie.web.shared.exception.ApiException;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TokenAuthImpl implements TokenAuth {

  private final StringRedisTemplate stringRedisTemplate;

  private final ObjectMapper objectMapper;

  @Override
  public CachedAuth authenticate(final String accessToken) throws JsonProcessingException {
    // 从 Redis 中获取登录信息
    final String authJson = stringRedisTemplate
        .opsForValue()
        .get(AuthServiceImpl.ACCESS_TOKEN_KEY_PREFIX + accessToken);

    if (authJson == null) {
      throw new ApiException(HttpStatus.UNAUTHORIZED, "访问令牌已过期");
    }

    // 返回登录信息
    return objectMapper.readValue(authJson, CachedAuth.class);
  }
}
