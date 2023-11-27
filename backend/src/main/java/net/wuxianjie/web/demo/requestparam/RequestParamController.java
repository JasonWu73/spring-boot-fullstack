package net.wuxianjie.web.demo.requestparam;

import com.fasterxml.jackson.annotation.JsonValue;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.ToString;
import net.wuxianjie.web.shared.Constants;
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
@Validated
@RestController
@RequestMapping("/api/v1/test/params")
public class RequestParamController {

    /**
     * 测试接收请求：
     *
     * <ul>
     *   <li>GET 传参</li>
     *   <li>POST 表单传参（仅支持文本）</li>
     *   <li>POST 表单传参（支持文本和文件）</li>
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
        System.out.printf("name=%s%num=%s%ntype=%s%ndateTime=%s%n", name, num, type, dateTime);

        final LocalDateTime returnDateTime = dateTime == null ? LocalDateTime.now() : dateTime;
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
     * 测试 POST JSON Body 传参。
     */
    @PostMapping("/json")
    public OuterData postJsonData(
            @RequestBody
            @Valid final OuterData data) {
        return data;
    }

    /**
     * 测试 POST 表单传参（支持文本和文件）。
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
