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
   * 将字节数组转换为十六进制字符串。
   *
   * @param bytes 字节数组
   * @return 十六进制字符串
   */
  public static String toHex(final byte[] bytes) {
    final StringBuilder stringBuilder = new StringBuilder();

    for (final byte aByte : bytes) {
      stringBuilder.append(String.format("%02X", aByte));
    }

    return stringBuilder.toString();
  }

  /**
   * 将十六进制字符串转换为字节数组。
   *
   * @param hex 十六进制字符串
   * @return 字节数组
   */
  public static byte[] toBytes(final String hex) {
    final int length = hex.length();
    final byte[] bytes = new byte[length / 2];

    for (int i = 0; i < length; i += 2) {
      bytes[i / 2] = (byte) (
        (Character.digit(hex.charAt(i), 16) << 4) +
        Character.digit(hex.charAt(i + 1), 16)
      );
    }

    return bytes;
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
