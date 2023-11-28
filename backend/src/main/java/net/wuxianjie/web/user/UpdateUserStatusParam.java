package net.wuxianjie.web.user;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import net.wuxianjie.web.shared.validator.EnumValidator;

@Data
public class UpdateUserStatusParam {

  /**
   * 账号状态。
   */
  @NotNull(message = "账号状态不能为 null")
  @EnumValidator(value = AccountStatus.class, message = "账号状态不合法")
  private Integer status;
}
