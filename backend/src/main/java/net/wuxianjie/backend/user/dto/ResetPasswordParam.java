package net.wuxianjie.backend.user.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * 重置密码参数。
 */
@Data
public class ResetPasswordParam {

  /**
   * 加密后的密码。
   */
  @NotBlank(message = "密码不能为空")
  private String password;
}
