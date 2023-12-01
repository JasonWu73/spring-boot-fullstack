package net.wuxianjie.web.shared.auth;

import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.ToString;

import java.util.Arrays;
import java.util.Objects;
import java.util.Optional;

/**
 * 系统可用权限。
 */
@Getter
@ToString
@RequiredArgsConstructor
public enum Authority {

  /**
   * 超级管理员。
   * <p>
   * 超级管理员权限，不但意味着能访问系统所有功能，也会忽略所有关于数据权限的限制。
   * <p>
   * 故该权限账号不能由管理界面进行创建，而是由系统内置一个。
   */
  ROOT("root"),

  /**
   * 管理员。
   */
  ADMIN("admin"),

  /**
   * 普通用户。
   */
  USER("user");

  private static final Authority[] VALUES;

  static {
    VALUES = values();
  }

  /**
   * 权限对应的字符串值。
   */
  @JsonValue
  private final String code;

  /**
   * 将字符串值解析为权限枚举值。
   *
   * @param value 需要解析的字符串值
   * @return 权限枚举值
   */
  public static Optional<Authority> resolve(final String value) {
    return Optional.ofNullable(value)
      .flatMap(val -> Arrays.stream(VALUES)
        .filter(theEnum -> Objects.equals(theEnum.code, val))
        .findFirst()
      );
  }
}
