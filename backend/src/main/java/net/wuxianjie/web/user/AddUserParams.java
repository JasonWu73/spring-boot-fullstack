package net.wuxianjie.web.user;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AddUserParams {

  /**
   * 用户名，必填。
   */
  @NotBlank(message = "用户名不能为空")
  private String username;

  /**
   * 昵称，必填。
   */
  @NotBlank(message = "昵称不能为空")
  private String nickname;

  /**
   * 密码，必填。
   */
  @NotBlank(message = "密码不能为空")
  private String password;

  /**
   * 功能权限列表。
   */
  private List<String> authorities;

  /**
   * 备注。
   */
  private String remark;
}
