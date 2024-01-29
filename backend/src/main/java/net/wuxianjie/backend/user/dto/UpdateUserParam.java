package net.wuxianjie.backend.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;
import lombok.Data;

/**
 * 更新用户参数。
 */
@Data
public class UpdateUserParam {

  /**
   * 昵称。
   */
  @NotBlank(message = "昵称不能为空")
  @Size(max = 255, message = "昵称长度不能超过 255")
  private String nickname;

  /**
   * 功能权限列表。
   */
  private List<String> authorities;

  /**
   * 备注。
   */
  @Size(max = 255, message = "备注长度不能超过 255")
  private String remark;
}
