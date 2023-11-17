package net.wuxianjie.web.user;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import net.wuxianjie.web.shared.validator.EnumValidator;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserStatusParams {

  /**
   * 账号状态，必填。
   */
  @NotNull(message = "账号状态不能为 null")
  @EnumValidator(value = AccountStatus.class, message = "账号状态不合法")
  private Integer status;
}
