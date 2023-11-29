package net.wuxianjie.web.shared.auth;

import lombok.extern.slf4j.Slf4j;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Slf4j
@Disabled
class PasswordEncoderTest {

  private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

  @Test
  void passwordEncoder() {
    final String rawPassword = "pass123";
    final String hashedPassword = passwordEncoder.encode(rawPassword);

    Assertions.assertThat(hashedPassword).isNotBlank();
    log.info("原密码: {}\n哈希密码: {}", rawPassword, hashedPassword);
  }
}
