package net.wuxianjie.backend.shared.auth;

import com.fasterxml.jackson.annotation.JsonValue;
import java.util.Arrays;
import java.util.Objects;
import java.util.Optional;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.ToString;

/**
 * 系统功能权限。
 */
@RequiredArgsConstructor
@Getter
@ToString
public enum Authority {

  /**
   * 超级管理员。
   * <p>
   * 超级管理员权限，不但意味着能访问系统所有功能，也会忽略所有关于数据权限的限制。
   * <p>
   * 故该权限账号不能由管理界面进行创建，而是由系统内置。
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
   * 获取权限上下级关系。
   *
   * @return 权限上下级关系字符串
   */
  public static String getHierarchy() {
    return """
      root > admin
      admin > user""";
  }

  /**
   * 将字符串值解析为权限枚举值。
   *
   * @param value 需要解析的字符串值
   * @return 权限枚举值
   */
  public static Optional<Authority> resolve(final String value) {
    return Optional
      .ofNullable(value)
      .flatMap(val -> Arrays
        .stream(VALUES)
        .filter(theEnum -> Objects.equals(theEnum.code, val))
        .findFirst());
  }
}
