package net.wuxianjie.web.user;

import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.ToString;
import net.wuxianjie.web.shared.mybatis.EnumType;

import java.util.Arrays;
import java.util.Optional;

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
   * 账号状态编码。
   */
  @JsonValue
  private final int code;

  /**
   * 根据编码解析账号状态。
   *
   * @param code 账号状态编码
   * @return 账号状态
   */
  public static Optional<AccountStatus> resolve(final Integer code) {
    return Optional.ofNullable(code)
      .flatMap(theCode -> Arrays.stream(VALUES)
        .filter(theEnum -> theEnum.code == theCode)
        .findFirst()
      );
  }
}
