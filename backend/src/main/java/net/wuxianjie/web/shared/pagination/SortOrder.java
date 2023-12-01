package net.wuxianjie.web.shared.pagination;

import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.ToString;

import java.util.Arrays;
import java.util.Objects;
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
   * 排序方式对应的字符串值。
   */
  @JsonValue
  private final String code;

  /**
   * 将字符串值解析为排序方式枚举值。
   *
   * @param value 需要解析的字符串值
   * @return 排序方式枚举值
   */
  public static Optional<SortOrder> resolve(final String value) {
    return Optional
      .ofNullable(value)
      .flatMap(val ->
        Arrays
          .stream(VALUES)
          .filter(theEnum -> Objects.equals(theEnum.code, val))
          .findFirst()
      );
  }
}
