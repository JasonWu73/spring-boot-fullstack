package net.wuxianjie.web.user;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import net.wuxianjie.web.shared.auth.AuthService;
import net.wuxianjie.web.shared.auth.AuthUtils;
import net.wuxianjie.web.shared.auth.dto.AuthResult;
import net.wuxianjie.web.shared.auth.dto.CachedAuth;
import net.wuxianjie.web.shared.auth.dto.LoginParam;
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

  // 公钥用于加密，分配给前端对用户名和密码进行加密传输
  // public static final String PUBLIC_KEY = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArbGWjwR4QAjBiJwMi5QNe+X8oPEFBfX3z5K6dSv9tU2kF9SVkf8uGGJwXeihQQ0o9aUk42zO58VL3MqDOaWHU6wm52pN9ZBbH0XJefqxtgyXrYAm279MU6EY4sywkUT9KOOgk/qDHB93IoEDL1fosYc7TRsAONuMGiyTJojn1FCPtJbbj7J56yCaFhUpuDunBFETQ32usRaK4KCWx9w0HZ6WmbX8QdcJkVjJ2FCLuGkvbKmUQ5h/GXXnNgbxIn3z2lX7snGRMhIFvW0Qjkn8YmOq6HUj7TU0jKm9VhZirVQXh8trvi2ivY7s6yJoF8N72Ekn94WSpSRVeC0XpXf2LQIDAQAB";

  /**
   * 私钥用于后端解密由前端传入用户名和密码，不要泄露。
   */
  public static final String PRIVATE_KEY = "MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCtsZaPBHhACMGInAyLlA175fyg8QUF9ffPkrp1K/21TaQX1JWR/y4YYnBd6KFBDSj1pSTjbM7nxUvcyoM5pYdTrCbnak31kFsfRcl5+rG2DJetgCbbv0xToRjizLCRRP0o46CT+oMcH3cigQMvV+ixhztNGwA424waLJMmiOfUUI+0ltuPsnnrIJoWFSm4O6cEURNDfa6xForgoJbH3DQdnpaZtfxB1wmRWMnYUIu4aS9sqZRDmH8Zdec2BvEiffPaVfuycZEyEgW9bRCOSfxiY6rodSPtNTSMqb1WFmKtVBeHy2u+LaK9juzrImgXw3vYSSf3hZKlJFV4LReld/YtAgMBAAECggEARUFg6cd7dvTGzgSCkAjJU5SBJV7UhOrtEyvLArs2ntrFSecueBcKNxjQ+vCtkzV/FmrxiWiyGwG03OU2a37PtZIXtP/S883KN27pBaTqxM7Cj6BgXhApi9LZDF1XLaUXV/1i4n3pVwZIx04vieoAUwC7qWPRs9n+Q9VwGtZNsX6Baxu1Le5qfg/zbRofODpLQa0XuLA8M5+ieBzwNrjrHvYQQ0GGaNxqvyoZaxx9SCBtvGwE8T0vHF+lXTYaotbazrtGT3OneWza4Qa0HRjgZKBHKyOzsZWpjiw8ISQxzpG0hD6o7+YeYpC3zt7ZLwuZOZOG0QPvzBioPvhDJP75tQKBgQDJtFlkeRanpF054rKLm32Udm4B1E43U/fjwgAM+X3jUN3PaXmpNKUFQTtB+symi20eTpw6HDumRNCi5q644wyjdF2nVDHi6lcAl63NLT0x7+431IHlrqd4UGnzh+T8pN3yiNvqlUrDYpXoKtSeRCJfbUCvLjwi8LHwzbbN7nOLRwKBgQDccv0bc+DL5N6JmfjMn7/851QKc4ugMrsJwZe/VE8Sxwop5dTBiTb1UXMAhUG+UMt03qtXav0b+3F5SFhZO/M+GhpVdVIPbyjPTjE/XUc+VBUIED+NT7vWbv+lTwcEpTwMdxTqrO1GHfURGWO0CiaPbkS6YVrn5sI71iQXe/YE6wKBgQDIBV64chPzPt1sL9Da/OD1vtOsYLsHxu8GHzYpp6gdKe4sZu5My3Xx1hRLg8g6R/13loD6Z1EHuyoiwRv3IMFBvn25F5c47SZF4iRqWThcMxBKsSP3ftF4UFYhOFvt5hhrESj0YgP36eW6i+6429wyQYdpsTHVfFcY8wcbBCH0tQKBgCp6LbMgfOxMyWSSOpKTJZdBq7vnz7uqiseyed7wC9x+ZcL0+i3glqpma1ZqVuSpBMscLL/HacX+iTrpabyoBJKuzOwykwFOVfq8AllHS/cClJrdJqG//12uPaxIsf1/KTbtqyYc9AtSsmn9Dm0el5eDk9Kl97I/kKWe+Y1c4WbJAoGBAKzMJSbxfDXpnwb48RWUAQK/o5b7Jyz2ZBmL9+UsoUG9hoqC9NngBOGR5NGE+xGJRfwBPyXZim4fL9hr7Xurw0cd39d86DikL+3l804thbSiegAQtHhn6Ko/UMjVTkPmjsdvY5OaWO2SQGhhzbfhaMqgiaUBOsQP4DAoJd5faQlu";

  /**
   * 访问令牌在 Redis 中的键前缀。
   */
  public static final String ACCESS_TOKEN_KEY_PREFIX = "access:";

  /**
   * 已登录用户在 Redis 中的键前缀。
   * <p>
   * 用于清除旧的登录信息（{@link #ACCESS_TOKEN_KEY_PREFIX}），防止同一个用户不停地往 Redis 中写入登录信息。
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
      username = RsaUtils.decrypt(param.getUsername(), PRIVATE_KEY);
      password = RsaUtils.decrypt(param.getPassword(), PRIVATE_KEY);
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
