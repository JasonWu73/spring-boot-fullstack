package net.wuxianjie.web.mybatis.dto;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import net.wuxianjie.web.shared.config.JsonConfig;
import org.springframework.format.annotation.DateTimeFormat;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MyBatisData {

  private Long id;

  @NotNull(message = "名称不能为空")
  private String name;

  private MyBatisType type;

  @NotNull(message = "date 不能为 null")
  @DateTimeFormat(pattern = JsonConfig.DATE_TIME_PATTERN)
  private Date date;

  @NotNull(message = "localDateTime 不能为 null")
  @DateTimeFormat(pattern = JsonConfig.DATE_TIME_PATTERN)
  private LocalDateTime localDateTime;

  @NotNull(message = "localDate 不能为 null")
  private LocalDate localDate;
}
