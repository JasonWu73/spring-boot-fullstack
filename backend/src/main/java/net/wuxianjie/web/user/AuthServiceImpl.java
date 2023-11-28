package net.wuxianjie.web.user;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import net.wuxianjie.web.shared.auth.*;
import net.wuxianjie.web.shared.config.Constants;
import net.wuxianjie.web.shared.exception.ApiException;
import net.wuxianjie.web.shared.util.RsaUtils;
import net.wuxianjie.web.shared.util.StrUtils;
import org.springframework.data.redis.connection.RedisStringCommands;
import org.springframework.data.redis.core.RedisCallback;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.types.Expiration;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

  /**
   * 访问令牌在 Redis 中的键前缀。
   */
  public static final String ACCESS_TOKEN_KEY_PREFIX = "access:";

  /**
   * 已登录用户在 Redis 中的键前缀。
   *
   * <p>用于清除旧的登录信息，防止同一个用户不停往 Redis 中写入登录信息。
   */
  public static final String LOGGED_IN_USER_KEY_PREFIX = "loggedIn:";

  private static final int TOKEN_EXPIRES_IN_SECONDS = 1800;

  private final HttpServletRequest request;
  private final StringRedisTemplate stringRedisTemplate;

  private final PasswordEncoder passwordEncoder;
  private final ObjectMapper objectMapper;
  private final UserMapper userMapper;

  @Override
  public AuthResponse login(final LoginParam param) {
    // 解密用户名和密码
    final String username;
    final String password;

    try {
      username = RsaUtils.decrypt(param.getUsername(), Constants.RSA_PRIVATE_KEY);
      password = RsaUtils.decrypt(param.getPassword(), Constants.RSA_PRIVATE_KEY);
    } catch (Exception e) {
      throw new ApiException(HttpStatus.UNAUTHORIZED, "用户名或密码错误", e);
    }

    // 从数据库中查询用户信息
    final User user = Optional
        .ofNullable(userMapper.selectByUsername(username))
        .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "用户名或密码错误"));

    // 检查账号状态
    checkAccountForbidden(user.getStatus());

    // 比较密码是否正确
    if (!passwordEncoder.matches(password, user.getHashedPassword())) {
      throw new ApiException(HttpStatus.UNAUTHORIZED, "用户名或密码错误");
    }

    // 生成访问令牌和刷新令牌
    final String accessToken = StrUtils.generateUuid();
    final String refreshToken = StrUtils.generateUuid();

    // 将登录信息写入 Spring Security Context
    final CachedAuth auth = getCachedAuth(user, accessToken, refreshToken);

    AuthUtils.setAuthenticatedContext(auth, request);

    // 从 Redis 中删除旧的登录信息
    deleteLoginCache(user.getUsername());

    // 保存登录信息至 Redis
    saveLoginCache(auth);

    // 返回响应数据
    return getAuthResponse(accessToken, refreshToken, auth);
  }

  @Override
  public void logout() {
    // 从 Spring Security Context 中获取当前登录信息
    final CachedAuth auth = AuthUtils.getCurrentUser().orElseThrow();

    // 退出登录
    logout(auth.username());
  }

  /**
   * 通过用户名退出登录，用于退出非当前登录用户。
   */
  public void logout(final String username) {
    // 从 Redis 中删除登录信息
    deleteLoginCache(username);
  }

  @Override
  public AuthResponse refresh(final String refreshToken) {
    // 从 Spring Security Context 中获取当前登录信息
    final CachedAuth oldAuth = AuthUtils.getCurrentUser().orElseThrow();

    // 检查刷新令牌是否正确
    if (!oldAuth.refreshToken().equals(refreshToken)) {
      throw new ApiException(HttpStatus.UNAUTHORIZED, "刷新令牌错误");
    }

    // 从 Redis 中删除旧的登录信息
    deleteLoginCache(oldAuth.username());

    // 从数据库中查询用户信息
    final User user = Optional
        .ofNullable(userMapper.selectById(oldAuth.userId()))
        .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "用户不存在"));

    // 检查账号状态
    checkAccountForbidden(user.getStatus());

    // 生成新的访问令牌和刷新令牌
    final String newAccessToken = StrUtils.generateUuid();
    final String newRefreshToken = StrUtils.generateUuid();

    // 保存登录信息至 Redis
    final CachedAuth newAuth = getCachedAuth(user, newAccessToken, newRefreshToken);

    saveLoginCache(newAuth);

    // 返回响应数据
    return getAuthResponse(newAccessToken, newRefreshToken, newAuth);
  }

  /**
   * 从 Redis 中删除登录信息。
   */
  private void deleteLoginCache(final String username) {
    stringRedisTemplate.executePipelined((RedisCallback<?>) connection -> {
      final byte[] accessTokenBytes = connection
          .stringCommands()
          .getDel((LOGGED_IN_USER_KEY_PREFIX + username).getBytes(StandardCharsets.UTF_8));

      if (accessTokenBytes != null) {
        final String accessKey =
            ACCESS_TOKEN_KEY_PREFIX + new String(accessTokenBytes, StandardCharsets.UTF_8);

        connection.keyCommands().del(accessKey.getBytes(StandardCharsets.UTF_8));
      }

      return null;
    });
  }

  /**
   * 保存登录信息至 Redis。
   */
  private void saveLoginCache(final CachedAuth auth) {
    stringRedisTemplate.executePipelined((RedisCallback<?>) connection -> {
      connection
          .stringCommands()
          .set(
              (ACCESS_TOKEN_KEY_PREFIX + auth.accessToken()).getBytes(StandardCharsets.UTF_8),
              toJsonString(auth).getBytes(StandardCharsets.UTF_8),
              Expiration.from(TOKEN_EXPIRES_IN_SECONDS, TimeUnit.SECONDS),
              RedisStringCommands.SetOption.UPSERT
          );

      connection
          .stringCommands()
          .set(
              (LOGGED_IN_USER_KEY_PREFIX + auth.username()).getBytes(StandardCharsets.UTF_8),
              auth.accessToken().getBytes(StandardCharsets.UTF_8),
              Expiration.from(TOKEN_EXPIRES_IN_SECONDS, TimeUnit.SECONDS),
              RedisStringCommands.SetOption.UPSERT
          );

      return null;
    });
  }

  private String toJsonString(final CachedAuth auth) {
    final String authJson;

    try {
      authJson = objectMapper.writeValueAsString(auth);
    } catch (JsonProcessingException e) {
      throw new RuntimeException(e);
    }

    return authJson;
  }

  private CachedAuth getCachedAuth(
      final User user,
      final String accessToken,
      final String refreshToken
  ) {
    return new CachedAuth(
        user.getId(),
        user.getUsername(),
        user.getNickname(),
        user.getAuthorities() == null
            ? List.of()
            : List.of(user.getAuthorities().split(",")),
        accessToken,
        refreshToken
    );
  }

  private static AuthResponse getAuthResponse(
      final String accessToken,
      final String refreshToken,
      final CachedAuth auth
  ) {
    return new AuthResponse(
        accessToken,
        refreshToken,
        TOKEN_EXPIRES_IN_SECONDS,
        auth.nickname(),
        auth.authorities()
    );
  }

  private void checkAccountForbidden(final AccountStatus status) {
    if (status == AccountStatus.DISABLED) {
      throw new ApiException(HttpStatus.FORBIDDEN, "账号已被禁用");
    }
  }
}
