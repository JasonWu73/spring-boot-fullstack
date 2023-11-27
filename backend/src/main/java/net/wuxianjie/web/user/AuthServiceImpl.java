package net.wuxianjie.web.user;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import net.wuxianjie.web.shared.Constants;
import net.wuxianjie.web.shared.auth.*;
import net.wuxianjie.web.shared.exception.ApiException;
import net.wuxianjie.web.shared.util.RsaUtils;
import net.wuxianjie.web.shared.util.StrUtils;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

  /**
   * 访问令牌在 Redis 中的键前缀。
   */
  public static final String KEY_PREFIX_ACCESS_TOKEN = "access:";

  /**
   * 已登录用户在 Redis 中的键前缀。
   *
   * <p>用于清除旧的登录信息，防止同一个用户不停往 Redis 中写入登录信息。
   */
  public static final String KEY_PREFIX_LOGGED_IN_USER = "loggedIn:";

  private static final int TOKEN_EXPIRES_IN_SECONDS = 1800;

  private final PasswordEncoder passwordEncoder;
  private final HttpServletRequest request;
  private final ObjectMapper objectMapper;
  private final StringRedisTemplate stringRedisTemplate;

  private final UserMapper userMapper;

  @Override
  public AuthResponse login(final LoginParams params) {
    // 解密用户名和密码
    final String username;
    final String password;
    try {
      username = RsaUtils.decrypt(params.getUsername(), Constants.RSA_PRIVATE_KEY);
      password = RsaUtils.decrypt(params.getPassword(), Constants.RSA_PRIVATE_KEY);
    } catch (Exception e) {
      throw new ApiException(HttpStatus.UNAUTHORIZED, "用户名或密码错误", e);
    }

    // 从数据库中查询用户信息
    final User user = Optional.ofNullable(userMapper.selectByUsername(username))
      .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "用户名或密码错误"));

    // 检查账号状态
    if (user.getStatus() == AccountStatus.DISABLED) {
      throw new ApiException(HttpStatus.FORBIDDEN, "账号已被禁用");
    }

    // 比较密码是否正确
    if (!passwordEncoder.matches(password, user.getHashedPassword())) {
      throw new ApiException(HttpStatus.UNAUTHORIZED, "用户名或密码错误");
    }

    // 生成访问令牌和刷新令牌
    final String accessToken = StrUtils.generateUuid();
    final String refreshToken = StrUtils.generateUuid();

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
    AuthUtils.setAuthenticatedContext(auth, request);

    // 从 Redis 中删除旧的登录信息
    final String oldAccessToken = stringRedisTemplate.opsForValue().get(
      KEY_PREFIX_LOGGED_IN_USER + user.getUsername()
    );

    if (oldAccessToken != null) {
      deleteLoginCache(oldAccessToken, user.getUsername());
    }

    // 保存登录信息至 Redis
    final String authJson;
    try {
      authJson = objectMapper.writeValueAsString(auth);
    } catch (JsonProcessingException e) {
      throw new RuntimeException(e);
    }

    saveLoginCache(accessToken, authJson, user.getUsername());

    // 返回响应数据
    return new AuthResponse(
      accessToken,
      refreshToken,
      TOKEN_EXPIRES_IN_SECONDS,
      user.getNickname(),
      auth.authorities()
    );
  }

  @Override
  public void logout() {
    // 从 Spring Security Context 中获取当前登录信息
    final CachedAuth auth = AuthUtils.getCurrentUser().orElseThrow();

    // 从 Redis 中删除登录信息
    deleteLoginCache(auth.accessToken(), auth.username());
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
    deleteLoginCache(oldAuth.accessToken(), oldAuth.username());

    // 从数据库中查询用户信息
    final User user = Optional.ofNullable(userMapper.selectById(oldAuth.userId()))
      .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "用户不存在"));

    // 检查账号状态
    if (user.getStatus() == AccountStatus.DISABLED) {
      throw new ApiException(HttpStatus.FORBIDDEN, "账号已被禁用");
    }

    // 生成新的访问令牌和刷新令牌
    final String newAccessToken = StrUtils.generateUuid();
    final String newRefreshToken = StrUtils.generateUuid();

    // 保存登录信息至 Redis
    final CachedAuth newAuth = new CachedAuth(
      user.getId(),
      user.getUsername(),
      user.getNickname(),
      user.getAuthorities() != null
        ? List.of(user.getAuthorities().split(","))
        : List.of(),
      newAccessToken,
      newRefreshToken
    );

    final String newAuthJson;
    try {
      newAuthJson = objectMapper.writeValueAsString(newAuth);
    } catch (JsonProcessingException e) {
      throw new RuntimeException(e);
    }

    saveLoginCache(newAccessToken, newAuthJson, user.getUsername());

    // 返回响应数据
    return new AuthResponse(
      newAccessToken,
      newRefreshToken,
      TOKEN_EXPIRES_IN_SECONDS,
      newAuth.nickname(),
      newAuth.authorities()
    );
  }

  /**
   * 通过用户名退出登录，用于退出非当前登录用户。
   */
  public void logout(final String username) {
    // 从 Redis 中删除登录信息
    final String accessToken = stringRedisTemplate.opsForValue().get(
      KEY_PREFIX_LOGGED_IN_USER + username
    );

    if (accessToken != null) {
      deleteLoginCache(accessToken, username);
    }
  }

  /**
   * 从 Redis 中删除登录信息。
   */
  private void deleteLoginCache(final String accessToken, final String username) {
    stringRedisTemplate.delete(KEY_PREFIX_ACCESS_TOKEN + accessToken);
    stringRedisTemplate.delete(KEY_PREFIX_LOGGED_IN_USER + username);
  }

  /**
   * 保存登录信息至 Redis。
   */
  private void saveLoginCache(
    final String accessToken,
    final String authJson,
    final String username
  ) {
    stringRedisTemplate.opsForValue().set(
      KEY_PREFIX_ACCESS_TOKEN + accessToken,
      authJson,
      TOKEN_EXPIRES_IN_SECONDS,
      TimeUnit.SECONDS
    );

    stringRedisTemplate.opsForValue().set(
      KEY_PREFIX_LOGGED_IN_USER + username,
      accessToken,
      TOKEN_EXPIRES_IN_SECONDS,
      TimeUnit.SECONDS
    );
  }
}
