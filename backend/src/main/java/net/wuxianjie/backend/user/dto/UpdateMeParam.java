package net.wuxianjie.backend.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * 更新当前用户信息参数。
 */
@Data
public class UpdateMeParam {

  /**
   * 昵称。
   */
  @NotBlank(message = "昵称不能为空")
  @Size(max = 255, message = "昵称长度不能超过 255")
  private String nickname;

  /**
   * 加密后的旧密码。
   * <p>
   * 与 {@link #newPassword} 要么同时存在，要么同时不存在。
   */
  private String oldPassword;

  /**
   * 加密后的新密码。
   * <p>
   * 与 {@link #oldPassword} 要么同时存在，要么同时不存在。
   */
  private String newPassword;
}
