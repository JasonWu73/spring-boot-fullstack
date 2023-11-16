package net.wuxianjie.web.demo.mybatis;

import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.ToString;
import net.wuxianjie.web.shared.mybatis.EnumType;

@Getter
@ToString
@RequiredArgsConstructor
public enum MyBatisType implements EnumType {

  TYPE_1(100),
  TYPE_2(200);

  @JsonValue
  private final int code;
}
