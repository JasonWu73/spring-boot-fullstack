package net.wuxianjie.web.shared.auth;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

class SecurityConfigTest {

  @Test
  void passwordEncoder() {
    final String rawPassword = "pass123";
    final String hashedPassword = new BCryptPasswordEncoder().encode(rawPassword);

    Assertions.assertThat(hashedPassword).isNotBlank();

    System.out.printf("原密码: %s, 哈希密码: %s%n", rawPassword, hashedPassword);
  }
}
