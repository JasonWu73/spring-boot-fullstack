package net.wuxianjie.backend.user.dto;

import lombok.Data;
import net.wuxianjie.backend.shared.validator.EnumValidator;
import net.wuxianjie.backend.user.AccountStatus;

/**
 * 用户查询参数。
 */
@Data
public class GetUserParam {

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
