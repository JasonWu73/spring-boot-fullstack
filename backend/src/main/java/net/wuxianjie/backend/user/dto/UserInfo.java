package net.wuxianjie.backend.user.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import net.wuxianjie.backend.user.AccountStatus;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 用户信息。
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserInfo {

  /**
   * 用户 ID。
   */
  private Long id;

  /**
   * 创建时间。
   */
  private LocalDateTime createdAt;

  /**
   * 更新时间。
   */
  private LocalDateTime updatedAt;

  /**
   * 备注。
   */
  private String remark;

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
  private AccountStatus status;

  /**
   * 功能权限列表。
   */
  private List<String> authorities;

  // 用于 MyBatis 的构造函数
  public UserInfo(
    final Long id,
    final LocalDateTime createdAt,
    final LocalDateTime updatedAt,
    final String remark,
    final String username,
    final String nickname,
    final AccountStatus status,
    final String authorities
  ) {
    this(
      id,
      createdAt,
      updatedAt,
      remark,
      username,
      nickname,
      status,
      authorities == null ?
        List.of() :
        List.of(authorities.split(","))
    );
  }
}
