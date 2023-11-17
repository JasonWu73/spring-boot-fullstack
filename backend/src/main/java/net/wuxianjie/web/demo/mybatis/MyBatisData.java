package net.wuxianjie.web.demo.mybatis;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import net.wuxianjie.web.shared.Constants;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MyBatisData {

  private Long id;

  @NotNull(message = "名称不能为 null")
  private String name;

  private MyBatisType type;

  @NotNull(message = "date 不能为 null")
  @DateTimeFormat(pattern = Constants.DATE_TIME_PATTERN)
  private Date date;

  @NotNull(message = "localDateTime 不能为 null")
  @DateTimeFormat(pattern = Constants.DATE_TIME_PATTERN)
  private LocalDateTime localDateTime;

  @NotNull(message = "localDate 不能为 null")
  private LocalDate localDate;
}
