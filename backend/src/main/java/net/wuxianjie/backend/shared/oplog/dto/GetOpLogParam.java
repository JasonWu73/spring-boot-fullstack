package net.wuxianjie.backend.shared.oplog.dto;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import lombok.Data;
import net.wuxianjie.backend.shared.json.JsonConfig;
import org.springframework.format.annotation.DateTimeFormat;

/**
 * 操作日志查询参数。
 */
@Data
public class GetOpLogParam {

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
