package net.wuxianjie.backend.shared.util;

import java.util.UUID;
import org.springframework.util.StringUtils;

/**
 * 字符串工具类。
 */
public class StrUtils {

  /**
   * 生成无 `-` 的 UUID。
   *
   * @return 无 `-` 的 UUID
   */
  public static String generateUuid() {
    return UUID.randomUUID().toString().replace("-", "");
  }

  /**
   * 按如下规则生成数据库 LIKE 值：
   *
   * <ul>
   *   <li>
   *     当 `value` 不为空时，则将字符串中任意数量的空白字符替换为 `%`，例如：
   *     <pre>{@code "  KeyOne    KeyTwo  " -> "%KeyOne%KeyTwo%"}</pre>
   *   </li>
   *   <li>当 `value` 为空时，则返回 `null`</li>
   * </ul>
   *
   * @param value 原始值
   * @return 如果 `value` 非空（至少包含一个非空字符），则返回符合数据库 LIKE 操作的字符串；否则，返回 `null`
   */
  public static String toLikeValue(final String value) {
    if (!StringUtils.hasText(value)) return null;

    return "%" + value.trim().replaceAll(" +", "%") + "%";
  }
}
