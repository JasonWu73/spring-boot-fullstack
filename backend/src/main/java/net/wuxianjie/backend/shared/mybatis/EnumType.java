package net.wuxianjie.backend.shared.mybatis;

/**
 * 实现该接口的枚举类，可完成枚举值与数据库中 {@code int} 类型值的自动进行转换。
 */
public interface EnumType {
  /**
   * 获取枚举值所对应的整数值。
   *
   * @return 枚举值所对应的整数值
   */
  int getCode();
}
