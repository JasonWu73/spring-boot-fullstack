package net.wuxianjie.web.shared.auth.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 登录参数。
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginParam {

  /**
   * 加密后的用户名（不区分大小写）。
   */
  @NotBlank(message = "用户名不能为空")
  private String username;

  /**
   * 加密后的密码。
   */
  @NotBlank(message = "密码不能为空")
  private String password;
}
