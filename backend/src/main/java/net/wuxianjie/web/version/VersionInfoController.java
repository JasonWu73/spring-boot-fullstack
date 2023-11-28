package net.wuxianjie.web.version;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/v1")
public class VersionInfoController {

  public static final String NAME = "Spring Boot Demo";
  public static final String DEVELOPER = "吴仙杰";

  // 请实时更新版本号
  public static final String VERSION = "v1.0.0";

  // 请实时更新构建时间
  public static final LocalDateTime BUILT_AT = LocalDateTime.of(2023, 11, 28, 14, 19, 30);

  /**
   * 获取项目版本号。
   *
   * <p>每次在生产环境中发布新包时都要更新版本号及构建时间。
   */
  @GetMapping("/version")
  public VersionInfo getVersion() {
    return new VersionInfo(NAME, DEVELOPER, VERSION, BUILT_AT);
  }
}
