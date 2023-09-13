package net.wuxianjie.web.demo;

import com.fasterxml.jackson.annotation.JsonValue;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.ToString;
import net.wuxianjie.web.demo.dto.DemoData;
import net.wuxianjie.web.demo.dto.DemoInnerData;
import net.wuxianjie.web.shared.validator.EnumValidator;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;

@Validated
@RestController
@RequestMapping("/api/v1")
public class DemoController {

  @GetMapping("/demo")
  public DemoData getData(
    @RequestParam String name,
    @NotNull(message = "num 不能为 null") Integer num,
    @EnumValidator(value = Type.class, message = "type 值不合法") Integer type
  ) {
    System.out.println(name + "---" + num + "---" + type);
    return new DemoData(100L, "测试数据", new DemoInnerData(new Date(), LocalDate.now(), LocalDateTime.now()));
  }

  @PostMapping("/demo/json")
  public DemoData postJsonData(@RequestBody @Valid DemoData data) {
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