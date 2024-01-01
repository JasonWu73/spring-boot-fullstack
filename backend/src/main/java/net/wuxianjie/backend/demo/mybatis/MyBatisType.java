package net.wuxianjie.backend.demo.mybatis;

import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.ToString;
import net.wuxianjie.backend.shared.mybatis.EnumType;

/**
 * 测试枚举值与数据库值的映射。
 */
@Getter
@ToString
@RequiredArgsConstructor
public enum MyBatisType implements EnumType {
  TYPE_1(100),
  TYPE_2(200);

  @JsonValue
  private final int code;
}
