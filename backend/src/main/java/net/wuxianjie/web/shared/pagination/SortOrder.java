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
   * 排序方式编码。
   */
  @JsonValue
  private final String code;

  /**
   * 根据编码解析排序方式。
   *
   * @param code 排序方式编码
   * @return 排序方式
   */
  public static Optional<SortOrder> resolve(final String code) {
    return Optional.ofNullable(code)
      .flatMap(theCode -> Arrays.stream(VALUES)
        .filter(theEnum -> Objects.equals(theEnum.code, theCode))
        .findFirst()
      );
  }
}
