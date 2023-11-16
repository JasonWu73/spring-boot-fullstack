package net.wuxianjie.web.user;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import net.wuxianjie.web.shared.validator.EnumValidator;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GetUserParams {

  /**
   * 用户名。
   */
  private String username;

  /**
   * 昵称。
   */
  private String nickname;

  /**
   * 账号状态。
   */
  @EnumValidator(value = AccountStatus.class, message = "账号状态不合法")
  private Integer status;

  /**
   * 权限。
   */
  private String authority;
}
