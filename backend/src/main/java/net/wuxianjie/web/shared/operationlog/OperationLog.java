package net.wuxianjie.web.shared.operationlog;

import lombok.Data;

import java.time.LocalDateTime;

/**
 * 操作日志。
 */
@Data
public class OperationLog {

  /**
   * 日志 id。
   */
  private Long id;

  /**
   * 请求时间。
   */
  private LocalDateTime requestedAt;

  /**
   * 客户端 IP。
   */
  private String clientIp;

  /**
   * 用户名。
   */
  private String username;

  /**
   * 操作描述。
   */
  private String message;
}
