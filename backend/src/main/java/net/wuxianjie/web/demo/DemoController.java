package net.wuxianjie.web.demo;

import com.fasterxml.jackson.annotation.JsonValue;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Date;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.ToString;
import net.wuxianjie.web.demo.dto.DemoData;
import net.wuxianjie.web.demo.dto.DemoInnerData;
import net.wuxianjie.web.shared.config.JsonConfig;
import net.wuxianjie.web.shared.validator.EnumValidator;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

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
        new DemoInnerData(Date.from(dateTime.toInstant(ZoneOffset.ofHours(8))),
            dateTime.toLocalDate(), dateTime)
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

  @PostMapping("/demo/upload")
  public UploadResult uploadFile(@NotBlank String message, @RequestParam MultipartFile file) {
    if (file == null || file.isEmpty()) {
      return new UploadResult(false, null, message);
    }

    return new UploadResult(true, file.getOriginalFilename(), message);
  }

  record UploadResult(boolean success, String filename, String message) {

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