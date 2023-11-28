package net.wuxianjie.web.user;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ResetPasswordParam {

  /**
   * 密码。
   */
  @NotBlank(message = "密码不能为空")
  private String password;
}
