package net.wuxianjie.backend.version;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 版本号 API。
 */
@RestController
@RequestMapping("/api/v1")
public class VersionController {

  /**
   * 项目版本号。
   * <p>
   * 每次在生产环境中发布新包时都要更新版本号。
   */
  private static final String VERSION = "v1.0.0";

  /**
   * 项目名称。
   */
  private static final String APP_NAME = "Spring Boot Demo";

  /**
   * 项目开发者。
   */
  private static final String DEVELOPER = "吴仙杰";

  /**
   * 获取项目版本号。
   * <p>
   * 每次在生产环境中发布新包时都要更新版本号。
   */
  @GetMapping("/public/version")
  public Version getVersion() {
    return new Version(VERSION, APP_NAME, DEVELOPER);
  }
}
