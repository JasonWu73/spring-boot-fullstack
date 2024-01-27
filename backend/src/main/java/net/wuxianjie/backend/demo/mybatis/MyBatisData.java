package net.wuxianjie.backend.demo.mybatis;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import net.wuxianjie.backend.shared.json.JsonConfig;
import org.springframework.format.annotation.DateTimeFormat;

/**
 * MyBatis 测试。
 *
 * <ul>
 *   <li>MysQL 中的 `int unsigned` 映射为 Java `Long`</li>
 *   <li>自定义的枚举值映射 {@link net.wuxianjie.backend.shared.mybatis.EnumType}</li>
 *   <li>MySQL 中的 `datetime` 映射为 Java `Date` 或 `LocalDateTime`</li>
 *   <li>MySQL 中的 `date` 映射为 Java `LocalDate`</li>
 * </ul>
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MyBatisData {

  private Long id;

  @NotNull(message = "名称不能为 null")
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
