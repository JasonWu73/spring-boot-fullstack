package net.wuxianjie.web.user.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import net.wuxianjie.web.shared.validator.EnumValidator;
import net.wuxianjie.web.user.AccountStatus;

/**
 * 更新用户状态参数。
 */
@Data
public class UpdateUserStatusParam {

  /**
   * 账号状态。
   */
  @NotNull(message = "账号状态不能为 null")
  @EnumValidator(value = AccountStatus.class, message = "账号状态不合法")
  private Integer status;
}
