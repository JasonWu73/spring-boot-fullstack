package net.wuxianjie.backend.shared.auth;

import net.wuxianjie.backend.shared.auth.dto.LoginParam;
import net.wuxianjie.backend.shared.auth.dto.LoginResult;

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
  LoginResult login(LoginParam param);

  /**
   * 刷新 Token。
   *
   * @param refreshToken 刷新令牌
   * @return 身份验证结果
   */
  LoginResult refresh(String refreshToken);

  /**
   * 退出登录。
   *
   * @param username 需要退出登录的用户名
   */
  void logout(String username);
}
