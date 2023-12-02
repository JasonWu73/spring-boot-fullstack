package net.wuxianjie.web.version;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

/**
 * 版本号 API。
 */
@RestController
@RequestMapping("/api/v1")
public class VersionController {

  /**
   * 项目名称。
   */
  private static final String NAME = "Spring Boot Demo";

  /**
   * 项目开发者。
   */
  private static final String DEVELOPER = "吴仙杰";

  /**
   * 项目版本号。
   * <p>
   * 每次在生产环境中发布新包时都要更新版本号及构建时间。
   */
  private static final String VERSION = "v1.0.0";

  /**
   * 项目构建时间。
   * <p>
   * 每次在生产环境中发布新包时都要更新版本号及构建时间。
   */
  private static final LocalDateTime BUILT_AT = LocalDateTime.of(2023, 12, 2, 15, 14, 32);

  /**
   * 获取项目版本号。
   * <p>
   * 每次在生产环境中发布新包时都要更新版本号及构建时间。
   */
  @GetMapping("/public/version")
  public Version getVersion() {
    return new Version(NAME, DEVELOPER, VERSION, BUILT_AT);
  }
}
