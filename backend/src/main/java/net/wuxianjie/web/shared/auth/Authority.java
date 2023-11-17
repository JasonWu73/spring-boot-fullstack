package net.wuxianjie.web.shared.auth;

import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.ToString;

import java.util.Arrays;
import java.util.Optional;

@Getter
@ToString
@RequiredArgsConstructor
public enum Authority {

  /**
   * {@code root} 作为超级权限，不但意味着能访问系统所有功能，也会忽略所有关于数据权限的限制。
   *
   * <p>故该权限账号不能由管理界面进行创建，而是由系统内置一个。
   */
  ROOT("root"),

  ADMIN("admin"),
  USER("user");

  private static final Authority[] VALUES;

  static {
    VALUES = values();
  }

  @JsonValue
  private final String code;

  public static Optional<Authority> resolve(final String code) {
    if (code == null) return Optional.empty();

    return Arrays.stream(VALUES)
      .filter(value -> value.code.equals(code))
      .findFirst();
  }
}
