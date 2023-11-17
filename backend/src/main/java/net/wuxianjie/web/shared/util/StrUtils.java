package net.wuxianjie.web.shared.util;

import java.util.UUID;

public class StrUtils {

  /**
   * 生成 UUID。
   */
  public static String generateUuid() {
    return UUID.randomUUID().toString().replace("-", "");
  }

  /**
   * 按如下规则生成数据库 LIKE 值：
   *
   * <ul>
   *   <li>
   *     当 {@code value} 不为空时，则将字符串中的空白字符替换为 {@code %}，例如：
   *     <pre>{@code "KeyOne    KeyTwo" -> "%KeyOne%KeyTwo%"}</pre>
   *   </li>
   *   <li>当 {@code value} 为空时，则返回 {@code null}</li>
   * </ul>
   */
  public static String toNullableLikeValue(final String value) {
    if (value == null) return null;

    return "%" + value.replaceAll(" +", "%") + "%";
  }
}