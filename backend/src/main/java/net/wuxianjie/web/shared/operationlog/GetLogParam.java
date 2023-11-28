package net.wuxianjie.web.shared.operationlog;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import net.wuxianjie.web.shared.config.Constants;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GetLogParam {

  /**
   * 开始日期。
   */
  @NotNull(message = "开始日期不能为 null")
  @DateTimeFormat(pattern = Constants.DATE_TIME_PATTERN)
  private LocalDate startAt;

  /**
   * 结束日期。
   */
  @NotNull(message = "结束日期不能为 null")
  @DateTimeFormat(pattern = Constants.DATE_TIME_PATTERN)
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
