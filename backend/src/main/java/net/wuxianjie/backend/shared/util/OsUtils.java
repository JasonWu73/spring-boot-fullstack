package net.wuxianjie.backend.shared.util;

/**
 * 操作系统工具类。
 */
public class OsUtils {

  /**
   * 判断当前系统是否为 Linux。
   *
   * @return 是否为 Linux 系统
   */
  public static boolean isLinux() {
    return System.getProperty("os.name").toLowerCase().contains("linux");
  }

  /**
   * 判断当前系统是否为 Windows。
   *
   * @return 是否为 Windows 系统
   */
  public static boolean isWindows() {
    return System.getProperty("os.name").toLowerCase().contains("windows");
  }

  /**
   * 判断当前系统是否为 macOS。
   *
   * @return 是否为 macOS 系统
   */
  public static boolean isMacOs() {
    return System.getProperty("os.name").toLowerCase().contains("mac");
  }
}
