package net.wuxianjie.web.demo.requestparam;

import com.fasterxml.jackson.annotation.JsonValue;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.ToString;
import lombok.extern.slf4j.Slf4j;
import net.wuxianjie.web.shared.config.Constants;
import net.wuxianjie.web.shared.validator.EnumValidator;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Date;

/**
 * 测试常用的请求参数接收方式。
 */
@Slf4j
@Validated
@RestController
@RequestMapping("/api/v1/test/params")
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
            @EnumValidator(value = Type.class, message = "type 值不合法")
            final Integer type,
            @DateTimeFormat(pattern = Constants.DATE_TIME_PATTERN)
            final LocalDateTime dateTime
    ) {
        log.info("name={}, num={}, type={}, dateTime={}", name, num, type, dateTime);

        final LocalDateTime returnDateTime = dateTime == null
                ? LocalDateTime.now()
                : dateTime;

        return new OuterData(
                100L,
                name,
                new InnerData(
                        Date.from(returnDateTime.toInstant(ZoneOffset.ofHours(8))),
                        returnDateTime.toLocalDate(),
                        returnDateTime
                )
        );
    }

    /**
     * POST JSON 传参。
     */
    @PostMapping("/json")
    public OuterData postJsonData(@RequestBody @Valid final OuterData data) {
        return data;
    }

    /**
     * 上传文件。
     */
    @PostMapping("/upload")
    public Uploaded uploadFile(
            @NotBlank final String message,
            @RequestParam final MultipartFile file
    ) {
        if (file == null || file.isEmpty()) return new Uploaded(false, null, message);

        return new Uploaded(true, file.getOriginalFilename(), message);
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
