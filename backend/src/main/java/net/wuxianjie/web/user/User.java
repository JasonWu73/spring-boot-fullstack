package net.wuxianjie.web.user;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class User {

  /**
   * 用户 id。
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
   * 哈希密码。
   */
  private String hashedPassword;

  /**
   * 账号状态。
   */
  private AccountStatus status;

  /**
   * 以英文逗号分隔的字符串。
   */
  private String authorities;
}
