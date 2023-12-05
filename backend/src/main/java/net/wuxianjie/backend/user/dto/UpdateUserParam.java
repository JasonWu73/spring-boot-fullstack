package net.wuxianjie.backend.user.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;

/**
 * 更新用户参数。
 */
@Data
public class UpdateUserParam {

  /**
   * 昵称。
   */
  @NotBlank(message = "昵称不能为空")
  private String nickname;

  /**
   * 功能权限列表。
   */
  private List<String> authorities;

  /**
   * 备注。
   */
  private String remark;
}