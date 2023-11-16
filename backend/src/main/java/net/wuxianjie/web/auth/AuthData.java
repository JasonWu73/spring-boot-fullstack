package net.wuxianjie.web.auth;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthData {

  /**
   * 用户 id。
   */
  private long userId;

  /**
   * 用户名。
   */
  private String username;

  /**
   * 哈希密码。
   */
  private String hashedPassword;

  /**
   * 昵称。
   */
  private String nickname;

  /**
   * 账号状态。
   */
  private AccountStatus status;

  /**
   * 功能权限列表。
   */
  private List<String> authorities;

  /**
   * 访问令牌，用于访问接口时的身份验证。
   */
  private String accessToken;

  /**
   * 刷新令牌，用于刷新访问令牌。
   */
  private String refreshToken;
}
