package net.wuxianjie.backend.shared.config;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import java.util.concurrent.TimeUnit;
import net.wuxianjie.backend.shared.auth.TokenAuth;
import net.wuxianjie.backend.shared.auth.dto.AuthenticatedUser;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Caffeine 本地缓存配置。
 */
@Configuration
public class CaffeineConfig {

  /**
   * 访问令牌缓存配置。
   *
   * @return 访问令牌缓存（`{ "accessToken": {@link AuthenticatedUser} }`）
   */
  @Bean
  public Cache<String, AuthenticatedUser> accessTokenCache() {
    return Caffeine
      .newBuilder()
      .expireAfterWrite(TokenAuth.TOKEN_EXPIRES_IN_SECONDS, TimeUnit.SECONDS)
      .build();
  }

  /**
   * 已登录用户名缓存配置。
   *
   * @return 已登录用户名缓存（`{ "username": accessToken }`）
   */
  @Bean
  public Cache<String, String> loggedInCache() {
    return Caffeine
      .newBuilder()
      .expireAfterWrite(TokenAuth.TOKEN_EXPIRES_IN_SECONDS, TimeUnit.SECONDS)
      .build();
  }
}
