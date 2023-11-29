package net.wuxianjie.web.shared.auth;

import net.wuxianjie.web.shared.auth.dto.LoginParam;

/**
 * 身份验证相关接口。
 */
public interface AuthService {

  /**
   * 登录。
   *
   * @param param 登录参数
   * @return 身份验证结果
   */
  AuthResult login(LoginParam param);

  /**
   * 退出。
   */
  void logout();

  /**
   * 刷新身份验证信息。
   *
   * @param refreshToken 刷新令牌
   * @return 身份验证结果
   */
  AuthResult refresh(String refreshToken);
}
