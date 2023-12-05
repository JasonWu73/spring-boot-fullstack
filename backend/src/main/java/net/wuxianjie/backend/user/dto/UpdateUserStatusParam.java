package net.wuxianjie.backend.user.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import net.wuxianjie.backend.shared.validator.EnumValidator;
import net.wuxianjie.backend.user.AccountStatus;

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
