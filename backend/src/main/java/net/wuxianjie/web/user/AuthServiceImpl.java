package net.wuxianjie.web.user;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import net.wuxianjie.web.shared.auth.*;
import net.wuxianjie.web.shared.exception.ApiException;
import net.wuxianjie.web.shared.util.RsaUtils;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

  private static final String KEY_PREFIX_AUTH = "auth:";
  private static final int TOKEN_EXPIRES_IN_SECONDS = 1800;

  private static final String RSA_PUBLIC_KEY = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCmWWFyJSaS/SMYr7hmCSXcwAvPF+aGPbbQFOt3rJXjDVKL2GhumWXH2y+dC5/DoaCtDz3dFTyzuoYyiuTHzbpsQ7ari8LoRunOJ81Hx0szpdKbOYJ5WnUr3mr7qEIwY5Verh1dgknNxuzeeTNlmAeLQj067+B+7m9+xp2WU+VSawIDAQAB";
  private static final String RSA_PRIVATE_KEY = "MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBAKZZYXIlJpL9IxivuGYJJdzAC88X5oY9ttAU63esleMNUovYaG6ZZcfbL50Ln8OhoK0PPd0VPLO6hjKK5MfNumxDtquLwuhG6c4nzUfHSzOl0ps5gnladSveavuoQjBjlV6uHV2CSc3G7N55M2WYB4tCPTrv4H7ub37GnZZT5VJrAgMBAAECgYAOZZ3xaxWzkwT+lfa3ngMQ3+4ltkPVSnIQAD+A1AcE55pFUC15pP0SFv4/8UmafNqTH8aS48ulIneK2EqEoGGJ6QUUQnmx8AhYGmANc9J7l4xZymUj7sUX7ipKCjfqomPbIZcxp2eRua3gunCXPo7HLFkZH8rmYOjdovw3IZzAQQJBAPIYpYZncyNZgWQa9pXRdZOghssGXnPrkUfiqdrAkZw6aGd8fspcm+4ahsULsWXVCvEmD6tyqtaB1S7xl18Laz0CQQCv5xU0v/9Z+4g39GauxTuh56N5AQ4WJxcCwP+iz8D5+Tkwf4FDmy4uDXMhgBcrEKmy7cKEKDlh+3LllG5DwC7HAkEAz7RrlvN8ahCpnVwwwPrS+FRaMSeGs8egfl8uQRrEEphd6KN8GFv5//9MLxRIH8j3OUvhV8PqZF1BrKPjrcybNQJAZzz49Ty6YdV+3VhT679WgG+zQhGccuP+XV9oqeXFHPFo3032T/eD4wOBzueesWfWMW3Z/DafdyJdDOFQ1fK1gQJAJAjujLut9M0W4AhMEOeIWmiG92zZd9v0sUx0S5ZiUus5cPPAiEpao+qbKXSb4WVAM8nsoe62Z+MvoB5nlBQcQw==";

  private final PasswordEncoder passwordEncoder;
  private final HttpServletRequest request;
  private final ObjectMapper objectMapper;
  private final StringRedisTemplate stringRedisTemplate;

  private final UserMapper userMapper;
  private final TokenAuth tokenAuth;

  @Override
  public TokenResponse login(final LoginParams params) {
    // 解密用户名和密码
    final String username;
    final String password;
    try {
      username = RsaUtils.decrypt(params.getUsername(), RSA_PRIVATE_KEY);
      password = RsaUtils.decrypt(params.getPassword(), RSA_PRIVATE_KEY);
    } catch (Exception e) {
      throw new ApiException(HttpStatus.UNAUTHORIZED, "用户名或密码错误", e);
    }

    // 从数据库中查询用户信息
    final User user = Optional.ofNullable(userMapper.selectByUsername(username))
      .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "用户名或密码错误"));

    // 比较密码是否正确
    if (!passwordEncoder.matches(password, user.getHashedPassword())) {
      throw new ApiException(HttpStatus.UNAUTHORIZED, "用户名或密码错误");
    }

    // 生成访问令牌和刷新令牌
    final String accessToken = generateUuid();
    final String refreshToken = generateUuid();

    // 将登录信息写入 Spring Security Context
    final CachedAuth auth = new CachedAuth(
      user.getId(),
      user.getUsername(),
      user.getNickname(),
      user.getAuthorities() != null
        ? List.of(user.getAuthorities().split(","))
        : List.of(),
      accessToken,
      refreshToken
    );
    tokenAuth.setAuthenticatedContext(auth, request);

    // 保存登录信息至 Redis
    final String authJson;
    try {
      authJson = objectMapper.writeValueAsString(auth);
    } catch (JsonProcessingException e) {
      throw new RuntimeException(e);
    }

    stringRedisTemplate.opsForValue().set(
      KEY_PREFIX_AUTH + username,
      authJson,
      TOKEN_EXPIRES_IN_SECONDS,
      TimeUnit.SECONDS
    );

    // 返回响应数据
    return new TokenResponse(
      accessToken,
      refreshToken,
      TOKEN_EXPIRES_IN_SECONDS,
      user.getNickname(),
      auth.authorities()
    );
  }

  @Override
  public TokenResponse refresh(final String refreshToken) {
    return null;
  }

  private String generateUuid() {
    return UUID.randomUUID().toString().replace("-", "");
  }
}
