package net.wuxianjie.springbootdemo.demo;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/v1")
public class DemoController {

  @GetMapping("/version")
  public Version getVersion() {
    return new Version("Spring Boot Demo", "v0.0.1", LocalDateTime.now());
  }

  record Version(String name, String version, LocalDateTime now) {}
}
