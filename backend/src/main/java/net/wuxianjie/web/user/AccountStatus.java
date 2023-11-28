package net.wuxianjie.web.user;

import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.ToString;
import net.wuxianjie.web.shared.mybatis.EnumType;

import java.util.Arrays;
import java.util.Optional;

@Getter
@ToString
@RequiredArgsConstructor
public enum AccountStatus implements EnumType {

  DISABLED(0),
  ENABLED(1);

  private static final AccountStatus[] VALUES;

  static {
    VALUES = values();
  }

  @JsonValue
  private final int code;

  public static Optional<AccountStatus> resolve(final Integer code) {
    if (code == null) return Optional.empty();

    return Arrays
        .stream(VALUES)
        .filter(value -> value.code == code)
        .findFirst();
  }
}
