package net.wuxianjie.web.user;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResetPasswordParams {

  /**
   * 密码。
   */
  @NotBlank(message = "密码不能为空")
  private String password;
}
