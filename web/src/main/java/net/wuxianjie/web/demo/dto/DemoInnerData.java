package net.wuxianjie.web.demo.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DemoInnerData {

  Date date;

  LocalDate localDate;

  @NotNull(message = "dateTime 不能为 null")
  LocalDateTime dateTime;
}
