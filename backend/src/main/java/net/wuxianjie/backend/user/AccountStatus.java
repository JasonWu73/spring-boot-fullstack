package net.wuxianjie.backend.user;

import com.fasterxml.jackson.annotation.JsonValue;
import java.util.Arrays;
import java.util.Optional;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.ToString;
import net.wuxianjie.backend.shared.mybatis.EnumType;

/**
 * 账号状态。
 */
@Getter
@ToString
@RequiredArgsConstructor
public enum AccountStatus implements EnumType {
  /**
   * 禁用。
   */
  DISABLED(0),

  /**
   * 启用。
   */
  ENABLED(1);

  private static final AccountStatus[] VALUES;

  static {
    VALUES = values();
  }

  /**
   * 账号状态对应的整数值。
   */
  @JsonValue
  private final int code;

  /**
   * 将整数值解析为账号状态枚举值。
   *
   * @param value 需要解析的整数值
   * @return 账号状态枚举值
   */
  public static Optional<AccountStatus> resolve(final Integer value) {
    return Optional
      .ofNullable(value)
      .flatMap(val ->
        Arrays.stream(VALUES).filter(theEnum -> theEnum.code == val).findFirst()
      );
  }
}
