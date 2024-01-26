package net.wuxianjie.backend.shared.auth;

import net.wuxianjie.backend.shared.auth.dto.AuthenticatedUser;

/**
 * 访问令牌身份验证接口。
 */
public interface TokenAuth {

  /**
   * 访问令牌的过期时间，单位为：秒。
   */
  int TOKEN_EXPIRES_IN_SECONDS = 30 * 60;

  /**
   * 验证访问令牌。
   *
   * @param accessToken 访问令牌
   * @return 身份验证通过后的用户信息
   * @throws Exception 验证失败时抛出
   */
  AuthenticatedUser authenticate(String accessToken) throws Exception;

  /**
   * 保存登录信息到系统缓存中。
   *
   * @param user 登录信息
   */
  void saveLoginCache(AuthenticatedUser user);

  /**
   * 从系统缓存中删除登录信息。
   *
   * @param username 需要删除登录信息的用户名
   */
  void deleteLoginCache(String username);
}
