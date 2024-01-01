package net.wuxianjie.backend.user;

import lombok.RequiredArgsConstructor;
import net.wuxianjie.backend.shared.auth.TokenAuth;
import net.wuxianjie.backend.shared.auth.dto.CachedAuth;
import net.wuxianjie.backend.shared.exception.ApiException;
import net.wuxianjie.backend.shared.json.JsonConverter;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

/**
 * 访问令牌身份验证业务逻辑实现。
 */
@Service
@RequiredArgsConstructor
public class TokenAuthImpl implements TokenAuth {

  private final StringRedisTemplate stringRedisTemplate;

  private final JsonConverter jsonConverter;

  /**
   * 验证访问令牌。
   * <p>
   * 通过访问令牌从 Redis 中获取登录信息，如果获取不到则抛出异常，代表身份验证失败。
   *
   * @param accessToken 需要被验证的访问令牌
   * @return 身份验证通过后的登录信息
   */
  @Override
  public CachedAuth authenticate(final String accessToken) {
    final String authJson = stringRedisTemplate
      .opsForValue()
      .get(AuthServiceImpl.ACCESS_TOKEN_KEY_PREFIX + accessToken);

    if (authJson == null) {
      throw new ApiException(HttpStatus.UNAUTHORIZED, "访问令牌已过期");
    }

    return jsonConverter.parseJson(authJson, CachedAuth.class);
  }
}
