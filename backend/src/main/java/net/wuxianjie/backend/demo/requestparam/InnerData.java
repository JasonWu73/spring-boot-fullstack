package net.wuxianjie.backend.demo.requestparam;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import net.wuxianjie.backend.shared.json.JsonConfig;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;

/**
 * 嵌套在外部数据中的内部数据。
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class InnerData {

  @DateTimeFormat(pattern = JsonConfig.DATE_TIME_PATTERN)
  Date date;

  LocalDate localDate;

  @NotNull(message = "dateTime 不能为 null")
  @DateTimeFormat(pattern = JsonConfig.DATE_TIME_PATTERN)
  LocalDateTime dateTime;
}
