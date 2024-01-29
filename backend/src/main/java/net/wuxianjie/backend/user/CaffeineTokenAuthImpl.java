package net.wuxianjie.backend.user;

import com.github.benmanes.caffeine.cache.Cache;
import jakarta.servlet.http.HttpServletRequest;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import net.wuxianjie.backend.shared.auth.AuthUtils;
import net.wuxianjie.backend.shared.auth.TokenAuth;
import net.wuxianjie.backend.shared.auth.dto.AuthenticatedUser;
import net.wuxianjie.backend.shared.exception.ApiException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

/**
 * 基于 Caffeine 本地缓存的访问令牌身份验证业务处理。
 */
@Service
@RequiredArgsConstructor
public class CaffeineTokenAuthImpl implements TokenAuth {

  private final HttpServletRequest request;

  private final Cache<String, AuthenticatedUser> accessTokenCache;
  private final Cache<String, String> loggedInCache;

  @Override
  public AuthenticatedUser authenticate(final String accessToken) {
    return Optional
      .ofNullable(accessTokenCache.getIfPresent(accessToken))
      .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "身份验证失败"));
  }

  @Override
  public void saveLoginCache(final AuthenticatedUser user) {
    // ----- 保存登录信息到 Spring Security Context -----
    AuthUtils.setAuthenticatedContext(user, request);

    // ----- 保存登录信息到本地缓存 -----
    loggedInCache.put(user.username(), user.accessToken());
    accessTokenCache.put(user.accessToken(), user);
  }

  @Override
  public void deleteLoginCache(final String username) {
    Optional
      .ofNullable(loggedInCache.getIfPresent(username))
      .ifPresent(accessToken -> {
        accessTokenCache.invalidate(accessToken);
        loggedInCache.invalidate(username);
      });
  }
}
