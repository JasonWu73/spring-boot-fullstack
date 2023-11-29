package net.wuxianjie.web;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.UserDetailsServiceAutoConfiguration;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * 后端服务启动类。
 *
 * <ul>
 *   <li>`@EnableScheduling`：开启定时任务执行功能</li>
 *   <li>`UserDetailsServiceAutoConfiguration.class`：排除以避免在控制台打印临时密码</li>
 * </ul>
 */
@EnableScheduling
@SpringBootApplication(exclude = {UserDetailsServiceAutoConfiguration.class})
public class BackendApp {

  /**
   * 启动后端服务。
   *
   * @param args 命令行参数
   */
  public static void main(final String[] args) {
    SpringApplication.run(BackendApp.class, args);
  }
}
