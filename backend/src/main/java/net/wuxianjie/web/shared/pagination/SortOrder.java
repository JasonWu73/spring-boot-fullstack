package net.wuxianjie.web.shared.pagination;

import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.ToString;

import java.util.Arrays;
import java.util.Optional;

/**
 * 排序方式。
 */
@Getter
@ToString
@RequiredArgsConstructor
public enum SortOrder {

    /**
     * 升序。
     */
    ASC("asc"),

    /**
     * 降序。
     */
    DESC("desc");

    private static final SortOrder[] VALUES;

    static {
        VALUES = values();
    }

    /**
     * 排序方式编码。
     */
    @JsonValue
    private final String code;

    public static Optional<SortOrder> resolve(final String code) {
        if (code == null) return Optional.empty();

        return Arrays
                .stream(VALUES)
                .filter(value -> value.code.equals(code))
                .findFirst();
    }
}
