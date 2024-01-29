package net.wuxianjie.backend.user;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.concurrent.TimeUnit;
import lombok.RequiredArgsConstructor;
import net.wuxianjie.backend.shared.auth.AuthUtils;
import net.wuxianjie.backend.shared.auth.TokenAuth;
import net.wuxianjie.backend.shared.auth.dto.AuthenticatedUser;
import net.wuxianjie.backend.shared.exception.ApiException;
import net.wuxianjie.backend.shared.json.JsonConverter;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

/**
 * 基于 Redis 的访问令牌身份验证业务处理。
 */
@Service
@RequiredArgsConstructor
public class RedisTokenAuthImpl implements TokenAuth {

  /**
   * 访问令牌在 Redis 中的键前缀：`{ "access:accessToken": {@link AuthenticatedUser} }`。
   */
  private static final String ACCESS_TOKEN_KEY_PREFIX = "access:";

  /**
   * 已登录用户在 Redis 中的键前缀：`{ "loggedIn:username": accessToken }`
   * <p>
   * 用于清除旧的登录信息（{@link #ACCESS_TOKEN_KEY_PREFIX}），以防止同一个用户通过不停登录或刷新身份验证信息，从而不断往 Redis 中写入登录信息。
   */
  private static final String LOGGED_IN_KEY_PREFIX = "loggedIn:";

  private final HttpServletRequest request;
  private final StringRedisTemplate stringRedisTemplate;

  private final JsonConverter jsonConverter;

  @Override
  public AuthenticatedUser authenticate(final String accessToken) {
    final String userJson = stringRedisTemplate
      .opsForValue()
      .get(ACCESS_TOKEN_KEY_PREFIX + accessToken);
    if (userJson == null) {
      throw new ApiException(HttpStatus.UNAUTHORIZED, "身份验证失败");
    }

    return jsonConverter.parse(userJson, AuthenticatedUser.class);
  }

  @Override
  public void saveLoginCache(final AuthenticatedUser user) {
    // ----- 保存登录信息到 Spring Security Context -----
    AuthUtils.setAuthenticatedContext(user, request);

    // ----- 保存登录信息到 Redis -----
    final String accessToken = user.accessToken();
    stringRedisTemplate
      .opsForValue()
      .set(
        LOGGED_IN_KEY_PREFIX + user.username(),
        accessToken,
        TOKEN_EXPIRES_IN_SECONDS,
        TimeUnit.SECONDS
      );
    stringRedisTemplate
      .opsForValue()
      .set(
        ACCESS_TOKEN_KEY_PREFIX + accessToken,
        jsonConverter.toJson(user),
        TOKEN_EXPIRES_IN_SECONDS,
        TimeUnit.SECONDS
      );
  }

  @Override
  public void deleteLoginCache(final String username) {
    final String loggedInKey = LOGGED_IN_KEY_PREFIX + username;
    final String accessToken = stringRedisTemplate.opsForValue().get(loggedInKey);
    if (accessToken == null) return;

    stringRedisTemplate.delete(
      List.of(
        ACCESS_TOKEN_KEY_PREFIX + accessToken,
        loggedInKey
      )
    );
  }
}
