package net.wuxianjie.web.user;

import lombok.RequiredArgsConstructor;
import net.wuxianjie.web.shared.auth.dto.CachedAuth;
import net.wuxianjie.web.shared.auth.TokenAuth;
import net.wuxianjie.web.shared.exception.ApiException;
import net.wuxianjie.web.shared.json.JsonConverter;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

/**
 * 访问令牌身份验证实现。
 */
@Service
@RequiredArgsConstructor
public class TokenAuthImpl implements TokenAuth {

  private final StringRedisTemplate stringRedisTemplate;

  private final JsonConverter jsonConverter;

  @Override
  public CachedAuth authenticate(final String accessToken) {
    // 从 Redis 中获取登录信息
    final String authJson = stringRedisTemplate.opsForValue()
      .get(AuthServiceImpl.ACCESS_TOKEN_KEY_PREFIX + accessToken);

    if (authJson == null) {
      throw new ApiException(HttpStatus.UNAUTHORIZED, "访问令牌已过期");
    }

    // 返回登录信息
    return jsonConverter.parseJson(authJson, CachedAuth.class);
  }
}
