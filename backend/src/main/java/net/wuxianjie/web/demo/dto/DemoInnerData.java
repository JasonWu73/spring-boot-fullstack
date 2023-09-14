package net.wuxianjie.web.demo.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import net.wuxianjie.web.shared.config.JsonConfig;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DemoInnerData {

  @DateTimeFormat(pattern = JsonConfig.DATE_TIME_PATTERN)
  Date date;

  LocalDate localDate;

  @NotNull(message = "dateTime 不能为 null")
  @DateTimeFormat(pattern = JsonConfig.DATE_TIME_PATTERN)
  LocalDateTime dateTime;
}