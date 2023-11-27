package net.wuxianjie.web.shared.auth;

import lombok.extern.slf4j.Slf4j;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Slf4j
class SecurityConfigTest {

    @Test
    @Disabled
    void passwordEncoder() {
        final String rawPassword = "pass123";
        final String hashedPassword = new BCryptPasswordEncoder().encode(rawPassword);

        Assertions.assertThat(hashedPassword).isNotBlank();

        log.info("原密码: {}, 哈希密码: {}", rawPassword, hashedPassword);
    }
}
