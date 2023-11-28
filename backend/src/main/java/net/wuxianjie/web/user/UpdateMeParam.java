package net.wuxianjie.web.user;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateMeParam {

  /**
   * 昵称。
   */
  @NotBlank(message = "昵称不能为空")
  private String nickname;

  /**
   * 旧密码。
   */
  private String oldPassword;

  /**
   * 新密码。
   *
   * <p>若旧密码存在，则新密码必填。
   */
  private String newPassword;
}
