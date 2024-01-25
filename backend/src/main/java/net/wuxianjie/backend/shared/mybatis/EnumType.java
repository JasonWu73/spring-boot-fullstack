package net.wuxianjie.backend.shared.mybatis;

/**
 * 实现该接口的枚举类，可实现枚举值与数据库中 `int` 值的自动类型转换。
 */
public interface EnumType {

  /**
   * 获取枚举值所对应的整数值。
   *
   * @return 枚举值所对应的整数值
   */
  int getCode();
}
