package net.wuxianjie.backend.demo.requestparam;

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
import lombok.extern.slf4j.Slf4j;
import net.wuxianjie.backend.shared.json.JsonConfig;
import net.wuxianjie.backend.shared.validator.EnumValidator;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

/**
 * 测试几种常用的请求参数接收方式。
 */
@RestController
@RequestMapping("/api/v1/public/params")
@Validated
@Slf4j
public class RequestParamController {

  /**
   * 请求默认支持的传参方式：
   *
   * <ul>
   *   <li>GET URL 传参</li>
   *   <li>POST x-www-form-urlencoded 传参（仅支持文本）</li>
   *   <li>POST form-data 传参（支持文本和文件）</li>
   * </ul>
   */
  @RequestMapping
  public OuterData getData(
    @RequestParam final String name,
    @NotNull(message = "num 不能为 null") final Integer num,
    @EnumValidator(value = Type.class, message = "type 值不合法") final Integer type,
    @DateTimeFormat(pattern = JsonConfig.DATE_TIME_PATTERN) final LocalDateTime dateTime
  ) {
    log.info("name={}, num={}, type={}, dateTime={}", name, num, type, dateTime);

    final LocalDateTime returned = dateTime == null
      ? LocalDateTime.now()
      : dateTime;
    return new OuterData(
      100L,
      name,
      new InnerData(
        Date.from(returned.toInstant(ZoneOffset.ofHours(8))),
        returned.toLocalDate(),
        returned
      )
    );
  }

  /**
   * POST form-data 上传文件。
   */
  @PostMapping("/upload")
  public Uploaded uploadFile(
    @NotBlank final String message,
    @RequestParam final MultipartFile file
  ) {
    if (file == null || file.isEmpty()) {
      return new Uploaded(false, null, message);
    }

    return new Uploaded(true, file.getOriginalFilename(), message);
  }

  /**
   * POST JSON 传参。
   */
  @PostMapping("/json")
  public OuterData postJsonData(@RequestBody @Valid final OuterData data) {
    return data;
  }

  @RequiredArgsConstructor
  @Getter
  @ToString
  enum Type {

    ONE(1);

    @JsonValue
    private final int code;
  }
}
