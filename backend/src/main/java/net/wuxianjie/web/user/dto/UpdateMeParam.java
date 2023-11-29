package net.wuxianjie.web.user.dto;

import jakarta.validation.constraints.NotBlank;
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
  private String nickname;

  /**
   * 加密后的旧密码。
   *
   * <p>`oldPassword` 与 `newPassword` 要么同时存在，要么同时不存在。
   */
  private String oldPassword;

  /**
   * 加密后的新密码。
   *
   * <p>`oldPassword` 与 `newPassword` 要么同时存在，要么同时不存在。
   */
  private String newPassword;
}
