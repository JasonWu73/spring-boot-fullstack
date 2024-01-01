package net.wuxianjie.backend.shared.auth;

import net.wuxianjie.backend.shared.auth.dto.AuthResult;
import net.wuxianjie.backend.shared.auth.dto.LoginParam;

/**
 * 身份验证业务接口。
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
   * 刷新身份验证信息。
   *
   * @param refreshToken 刷新令牌
   * @return 身份验证结果
   */
  AuthResult refresh(String refreshToken);

  /**
   * 退出登录。
   */
  void logout();
}
