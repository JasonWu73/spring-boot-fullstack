package net.wuxianjie.web;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * Web 应用程序启动类。
 */
@SpringBootApplication
@EnableScheduling
public class BackendApp {

  public static void main(String[] args) {
    SpringApplication.run(BackendApp.class, args);
  }
}
