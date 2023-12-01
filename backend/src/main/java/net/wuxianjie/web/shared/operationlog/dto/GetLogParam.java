package net.wuxianjie.web.shared.operationlog.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import net.wuxianjie.web.shared.json.JsonConfig;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

/**
 * 操作日志查询参数。
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GetLogParam {

  /**
   * 开始日期。
   */
  @NotNull(message = "开始日期不能为 null")
  @DateTimeFormat(pattern = JsonConfig.DATE_TIME_PATTERN)
  private LocalDate startAt;

  /**
   * 结束日期。
   */
  @NotNull(message = "结束日期不能为 null")
  @DateTimeFormat(pattern = JsonConfig.DATE_TIME_PATTERN)
  private LocalDate endAt;

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
