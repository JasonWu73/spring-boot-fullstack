package net.wuxianjie.web.shared.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginParams {

  /**
   * 加密后的用户名（不区分大小写），必填。
   */
  @NotBlank(message = "用户名不能为空")
  private String username;

  /**
   * 加密后的密码，必填。
   */
  @NotBlank(message = "密码不能为空")
  private String password;
}
