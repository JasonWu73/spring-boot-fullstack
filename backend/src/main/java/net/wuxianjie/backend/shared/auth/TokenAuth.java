package net.wuxianjie.backend.shared.auth;

import net.wuxianjie.backend.shared.auth.dto.CachedAuth;

/**
 * 访问令牌身份验证接口。
 */
public interface TokenAuth {

  /**
   * 验证访问令牌。
   *
   * @param accessToken 需要被验证的访问令牌
   * @return 身份验证通过后的登录信息
   * @throws Exception 验证失败时抛出
   */
  CachedAuth authenticate(String accessToken) throws Exception;
}