package net.wuxianjie.springbootdemo.demo;

import lombok.RequiredArgsConstructor;
import org.springframework.core.env.Environment;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class DemoController {

  public static final String ENV_NAME = "NAME";

  private final Environment environment;

  @GetMapping("/version")
  public Version getVersion() {
    String name = Optional.ofNullable(environment.getProperty(ENV_NAME)).orElse("Spring Boot Demo");
    return new Version(name, "v0.0.1", LocalDateTime.now());
  }

  record Version(String name, String version, LocalDateTime now) {}
}
