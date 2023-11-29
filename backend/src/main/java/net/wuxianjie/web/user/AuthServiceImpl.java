package net.wuxianjie.web.user;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import net.wuxianjie.web.shared.auth.*;
import net.wuxianjie.web.shared.auth.dto.AuthResult;
import net.wuxianjie.web.shared.auth.dto.CachedAuth;
import net.wuxianjie.web.shared.auth.dto.LoginParam;
import net.wuxianjie.web.shared.config.Constants;
import net.wuxianjie.web.shared.exception.ApiException;
import net.wuxianjie.web.shared.json.JsonConverter;
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
import java.util.Objects;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

/**
 * 身份验证实现。
 */
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
   * <p>用于清除旧的登录信息，防止同一个用户不停地往 Redis 中写入登录信息。
   */
  public static final String LOGGED_IN_KEY_PREFIX = "loggedIn:";

  private static final int TOKEN_EXPIRES_IN_SECONDS = 1800;

  private final HttpServletRequest request;
  private final StringRedisTemplate stringRedisTemplate;

  private final PasswordEncoder passwordEncoder;
  private final JsonConverter jsonConverter;
  private final UserMapper userMapper;

  @Override
  public AuthResult login(final LoginParam param) {
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
    final User user = Optional.ofNullable(userMapper.selectByUsername(username))
      .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "用户名或密码错误"));

    // 检查账号可用性
    checkUserUsability(user.getStatus());

    // 检查密码是否正确
    if (!passwordEncoder.matches(password, user.getHashedPassword())) {
      throw new ApiException(HttpStatus.UNAUTHORIZED, "用户名或密码错误");
    }

    // 身份验证通过，删除旧的登录缓存
    deleteLoginCache(user.getUsername());

    // 生成访问令牌和刷新令牌
    final String accessToken = StrUtils.generateUuid();
    final String refreshToken = StrUtils.generateUuid();

    // 将登录信息写入缓存中
    final CachedAuth auth = getCachedAuth(user, accessToken, refreshToken);
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
   * 通过用户名退出登录。
   *
   * @param username 需要退出登录的用户名
   */
  public void logout(final String username) {
    // 删除登录缓存
    deleteLoginCache(username);
  }

  @Override
  public AuthResult refresh(final String refreshToken) {
    // 从 Spring Security Context 中获取当前登录信息
    final CachedAuth oldAuth = AuthUtils.getCurrentUser().orElseThrow();

    // 检查刷新令牌是否正确
    if (!Objects.equals(oldAuth.refreshToken(), refreshToken)) {
      throw new ApiException(HttpStatus.UNAUTHORIZED, "刷新令牌错误");
    }

    // 身份验证通过，删除旧的登录缓存
    deleteLoginCache(oldAuth.username());

    // 从数据库中查询用户信息
    final User user = Optional.ofNullable(userMapper.selectById(oldAuth.userId()))
      .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "用户不存在"));

    // 检查账号可用性
    checkUserUsability(user.getStatus());

    // 生成新的访问令牌和刷新令牌
    final String newAccessToken = StrUtils.generateUuid();
    final String newRefreshToken = StrUtils.generateUuid();

    // 将登录信息写入缓存中
    final CachedAuth newAuth = getCachedAuth(user, newAccessToken, newRefreshToken);
    saveLoginCache(newAuth);

    // 返回响应数据
    return getAuthResponse(newAccessToken, newRefreshToken, newAuth);
  }

  /**
   * 删除登录缓存。
   *
   * @param username 需要删除登录缓存的用户名
   */
  private void deleteLoginCache(final String username) {
    final String loggedInKey = LOGGED_IN_KEY_PREFIX + username;
    final String accessToken = stringRedisTemplate.opsForValue().get(loggedInKey);

    if (accessToken == null) return;

    stringRedisTemplate.delete(List.of(
      ACCESS_TOKEN_KEY_PREFIX + accessToken,
      loggedInKey
    ));
  }

  /**
   * 保存登录缓存。
   *
   * @param auth 登录信息
   */
  private void saveLoginCache(final CachedAuth auth) {
    // 将登录信息写入 Spring Security Context
    AuthUtils.setAuthenticatedContext(auth, request);

    // 保存登录信息至 Redis
    stringRedisTemplate.executePipelined((RedisCallback<?>) connection -> {
      connection.stringCommands()
        .set(
          (ACCESS_TOKEN_KEY_PREFIX + auth.accessToken())
            .getBytes(StandardCharsets.UTF_8),
          jsonConverter.toJson(auth)
            .getBytes(StandardCharsets.UTF_8),
          Expiration.from(TOKEN_EXPIRES_IN_SECONDS, TimeUnit.SECONDS),
          RedisStringCommands.SetOption.UPSERT
        );

      connection.stringCommands()
        .set(
          (LOGGED_IN_KEY_PREFIX + auth.username())
            .getBytes(StandardCharsets.UTF_8),
          auth.accessToken()
            .getBytes(StandardCharsets.UTF_8),
          Expiration.from(TOKEN_EXPIRES_IN_SECONDS, TimeUnit.SECONDS),
          RedisStringCommands.SetOption.UPSERT
        );

      return null;
    });
  }

  private void checkUserUsability(final AccountStatus status) {
    if (status == AccountStatus.DISABLED) {
      throw new ApiException(HttpStatus.FORBIDDEN, "账号已被禁用");
    }
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

  private static AuthResult getAuthResponse(
    final String accessToken,
    final String refreshToken,
    final CachedAuth auth
  ) {
    return new AuthResult(
      accessToken,
      refreshToken,
      TOKEN_EXPIRES_IN_SECONDS,
      auth.nickname(),
      auth.authorities()
    );
  }
}
