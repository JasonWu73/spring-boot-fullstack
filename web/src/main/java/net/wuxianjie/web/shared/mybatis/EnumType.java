package net.wuxianjie.web.shared.mybatis;

/**
 * 数据库枚举类型值接口。
 *
 * <p>MyBatis 会自动处理实现了该接口的枚举值与数据库值的转换。
 */
public interface EnumType {

  /**
   * 获取枚举类型值所对应的整数值。
   *
   * @return 类型的整数值
   */
  int getCode();
}
