package net.wuxianjie.web.shared.pagination;

import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.ToString;

import java.util.Arrays;
import java.util.Optional;

@Getter
@ToString
@RequiredArgsConstructor
public enum OrderBy {

  ASC("asc"),
  DESC("desc");

  private static final OrderBy[] VALUES;

  static {
    VALUES = values();
  }

  @JsonValue
  private final String code;

  public static Optional<OrderBy> resolve(final String code) {
    if (code == null) return Optional.empty();

    return Arrays.stream(VALUES)
      .filter(value -> value.code.equals(code))
      .findFirst();
  }
}
