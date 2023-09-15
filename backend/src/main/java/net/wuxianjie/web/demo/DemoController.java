package net.wuxianjie.web.demo;

import com.fasterxml.jackson.annotation.JsonValue;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.ToString;
import net.wuxianjie.web.demo.dto.DemoData;
import net.wuxianjie.web.demo.dto.DemoInnerData;
import net.wuxianjie.web.shared.config.JsonConfig;
import net.wuxianjie.web.shared.validator.EnumValidator;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Date;

@CrossOrigin
@Validated
@RestController
@RequestMapping("/api/v1")
public class DemoController {

  @GetMapping("/demo")
  public DemoData getData(
    @RequestParam String name,
    @NotNull(message = "num 不能为 null") Integer num,
    @EnumValidator(value = Type.class, message = "type 值不合法") Integer type,
    @DateTimeFormat(pattern = JsonConfig.DATE_TIME_PATTERN) LocalDateTime dateTime
  ) {
    System.out.println(name + "---" + num + "---" + type + "---" + dateTime);
    return new DemoData(
      100L,
      "测试数据",
      new DemoInnerData(Date.from(dateTime.toInstant(ZoneOffset.ofHours(8))), dateTime.toLocalDate(), dateTime)
    );
  }

  @PostMapping("/demo/json")
  public DemoData postJsonData(@RequestBody @Valid DemoData data) {
    return data;
  }

  @PostMapping("/demo/form")
  public DemoData postFormData(@Valid DemoData data) {
    return data;
  }

  @Getter
  @ToString
  @RequiredArgsConstructor
  enum Type {

    ONE(1);

    @JsonValue
    private final int code;
  }
}