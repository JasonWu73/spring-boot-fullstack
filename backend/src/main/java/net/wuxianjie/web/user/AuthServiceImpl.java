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
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

/**
 * 身份验证业务逻辑实现。
 */
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

  // 公钥用于加密，分配给前端对用户名和密码进行加密传输
  // public static final String PUBLIC_KEY = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArbGWjwR4QAjBiJwMi5QNe+X8oPEFBfX3z5K6dSv9tU2kF9SVkf8uGGJwXeihQQ0o9aUk42zO58VL3MqDOaWHU6wm52pN9ZBbH0XJefqxtgyXrYAm279MU6EY4sywkUT9KOOgk/qDHB93IoEDL1fosYc7TRsAONuMGiyTJojn1FCPtJbbj7J56yCaFhUpuDunBFETQ32usRaK4KCWx9w0HZ6WmbX8QdcJkVjJ2FCLuGkvbKmUQ5h/GXXnNgbxIn3z2lX7snGRMhIFvW0Qjkn8YmOq6HUj7TU0jKm9VhZirVQXh8trvi2ivY7s6yJoF8N72Ekn94WSpSRVeC0XpXf2LQIDAQAB";

  /**
   * 私钥用于后端解密由前端传入的用户名和密码，不要泄露。
   */
  public static final String PRIVATE_KEY = "MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCtsZaPBHhACMGInAyLlA175fyg8QUF9ffPkrp1K/21TaQX1JWR/y4YYnBd6KFBDSj1pSTjbM7nxUvcyoM5pYdTrCbnak31kFsfRcl5+rG2DJetgCbbv0xToRjizLCRRP0o46CT+oMcH3cigQMvV+ixhztNGwA424waLJMmiOfUUI+0ltuPsnnrIJoWFSm4O6cEURNDfa6xForgoJbH3DQdnpaZtfxB1wmRWMnYUIu4aS9sqZRDmH8Zdec2BvEiffPaVfuycZEyEgW9bRCOSfxiY6rodSPtNTSMqb1WFmKtVBeHy2u+LaK9juzrImgXw3vYSSf3hZKlJFV4LReld/YtAgMBAAECggEARUFg6cd7dvTGzgSCkAjJU5SBJV7UhOrtEyvLArs2ntrFSecueBcKNxjQ+vCtkzV/FmrxiWiyGwG03OU2a37PtZIXtP/S883KN27pBaTqxM7Cj6BgXhApi9LZDF1XLaUXV/1i4n3pVwZIx04vieoAUwC7qWPRs9n+Q9VwGtZNsX6Baxu1Le5qfg/zbRofODpLQa0XuLA8M5+ieBzwNrjrHvYQQ0GGaNxqvyoZaxx9SCBtvGwE8T0vHF+lXTYaotbazrtGT3OneWza4Qa0HRjgZKBHKyOzsZWpjiw8ISQxzpG0hD6o7+YeYpC3zt7ZLwuZOZOG0QPvzBioPvhDJP75tQKBgQDJtFlkeRanpF054rKLm32Udm4B1E43U/fjwgAM+X3jUN3PaXmpNKUFQTtB+symi20eTpw6HDumRNCi5q644wyjdF2nVDHi6lcAl63NLT0x7+431IHlrqd4UGnzh+T8pN3yiNvqlUrDYpXoKtSeRCJfbUCvLjwi8LHwzbbN7nOLRwKBgQDccv0bc+DL5N6JmfjMn7/851QKc4ugMrsJwZe/VE8Sxwop5dTBiTb1UXMAhUG+UMt03qtXav0b+3F5SFhZO/M+GhpVdVIPbyjPTjE/XUc+VBUIED+NT7vWbv+lTwcEpTwMdxTqrO1GHfURGWO0CiaPbkS6YVrn5sI71iQXe/YE6wKBgQDIBV64chPzPt1sL9Da/OD1vtOsYLsHxu8GHzYpp6gdKe4sZu5My3Xx1hRLg8g6R/13loD6Z1EHuyoiwRv3IMFBvn25F5c47SZF4iRqWThcMxBKsSP3ftF4UFYhOFvt5hhrESj0YgP36eW6i+6429wyQYdpsTHVfFcY8wcbBCH0tQKBgCp6LbMgfOxMyWSSOpKTJZdBq7vnz7uqiseyed7wC9x+ZcL0+i3glqpma1ZqVuSpBMscLL/HacX+iTrpabyoBJKuzOwykwFOVfq8AllHS/cClJrdJqG//12uPaxIsf1/KTbtqyYc9AtSsmn9Dm0el5eDk9Kl97I/kKWe+Y1c4WbJAoGBAKzMJSbxfDXpnwb48RWUAQK/o5b7Jyz2ZBmL9+UsoUG9hoqC9NngBOGR5NGE+xGJRfwBPyXZim4fL9hr7Xurw0cd39d86DikL+3l804thbSiegAQtHhn6Ko/UMjVTkPmjsdvY5OaWO2SQGhhzbfhaMqgiaUBOsQP4DAoJd5faQlu";

  /**
   * 访问令牌在 Redis 中的键前缀。
   */
  public static final String ACCESS_TOKEN_KEY_PREFIX = "access:";

  /**
   * 已登录用户在 Redis 中的键前缀。
   * <p>
   * 用于清除旧的登录信息（{@link #ACCESS_TOKEN_KEY_PREFIX}），以防止同一个用户通过不停登录或刷新身份验证信息，从而不断往 Redis 中写入登录信息。
   */
  public static final String LOGGED_IN_KEY_PREFIX = "loggedIn:";

  private static final int TOKEN_EXPIRES_IN_SECONDS = 1800;

  private final HttpServletRequest request;
  private final StringRedisTemplate stringRedisTemplate;

  private final PasswordEncoder passwordEncoder;
  private final JsonConverter jsonConverter;
  private final UserMapper userMapper;

  /**
   * 登录。
   *
   * <ol>
   *   <li>使用私钥解密传入的用户名和密码</li>
   *   <li>验证用户账号是否已被禁用</li>
   *   <li>验证密码是否正确</li>
   *   <li>在身份验证通过后，删除旧的 {@link #ACCESS_TOKEN_KEY_PREFIX} 缓存，以防止同一个用户通过不断登录，从而不断往 Redis 中写入登录信息</li>
   *   <li>生成新的访问令牌和刷新令牌</li>
   *   <li>将登录信息写入 Spring Security Context，以便像 {@link net.wuxianjie.web.shared.operationlog.OperationLogAspect} 这样的 AOP 可以获取到当前登录用户的信息</li>
   *   <li>将登录信息写入 Redis</li>
   * </ol>
   *
   * @param param 登录参数
   * @return 身份验证结果
   */
  @Override
  public AuthResult login(final LoginParam param) {
    final String username;
    final String password;

    try {
      username = RsaUtils.decrypt(param.getUsername(), PRIVATE_KEY);
      password = RsaUtils.decrypt(param.getPassword(), PRIVATE_KEY);
    } catch (Exception e) {
      throw new ApiException(HttpStatus.UNAUTHORIZED, "用户名或密码错误", e);
    }

    final User user = Optional
      .ofNullable(userMapper.selectByUsername(username))
      .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "用户名或密码错误"));

    checkUserUsability(user.getStatus());

    if (!passwordEncoder.matches(password, user.getHashedPassword())) {
      throw new ApiException(HttpStatus.UNAUTHORIZED, "用户名或密码错误");
    }

    deleteAccessTokenCache(username);

    final String accessToken = StrUtils.generateUuid();
    final String refreshToken = StrUtils.generateUuid();

    final CachedAuth auth = getCachedAuth(user, accessToken, refreshToken);
    saveLoginCache(auth);

    return getAuthResult(accessToken, refreshToken, auth);
  }

  /**
   * 刷新身份验证信息。
   *
   * <ol>
   *   <li>从 Spring Security Context 中获取当前登录信息</li>
   *   <li>验证刷新令牌是否与缓存中的刷新停牌一致</li>
   *   <li>在刷新令牌验证通过后，删除旧的 {@link #ACCESS_TOKEN_KEY_PREFIX} 缓存，以防止同一个用户通过不断刷新身份验证信息，从而不断往 Redis 中写入登录信息</li>
   *   <li>验证用户账号是否已被禁用</li>
   *   <li>生成新的访问令牌和刷新令牌</li>
   *   <li>将登录信息写入 Spring Security Context，以便像 {@link net.wuxianjie.web.shared.operationlog.OperationLogAspect} 这样的 AOP 可以获取到当前登录用户的信息</li>
   *   <li>将登录信息写入 Redis</li>
   * </ol>
   *
   * @param refreshToken 刷新令牌
   * @return 身份验证结果
   */
  @Override
  public AuthResult refresh(final String refreshToken) {
    final CachedAuth oldAuth = AuthUtils.getCurrentUser().orElseThrow();

    if (!Objects.equals(oldAuth.refreshToken(), refreshToken)) {
      throw new ApiException(HttpStatus.UNAUTHORIZED, "刷新令牌错误");
    }

    deleteAccessTokenCache(oldAuth.username());

    final User user = Optional
      .ofNullable(userMapper.selectById(oldAuth.userId()))
      .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "用户不存在"));

    checkUserUsability(user.getStatus());

    final String newAccessToken = StrUtils.generateUuid();
    final String newRefreshToken = StrUtils.generateUuid();

    final CachedAuth newAuth = getCachedAuth(user, newAccessToken, newRefreshToken);
    saveLoginCache(newAuth);

    return getAuthResult(newAccessToken, newRefreshToken, newAuth);
  }

  /**
   * 退出登录。
   *
   * <ul>
   *   <li>从 Spring Security Context 中获取当前登录信息</li>
   *   <li>删除登录缓存</li>
   * </ul>
   */
  @Override
  public void logout() {
    final CachedAuth auth = AuthUtils.getCurrentUser().orElseThrow();
    logout(auth.username());
  }

  /**
   * 将指定用户名的用户从系统中退出登录。
   *
   * @param username 需要退出登录的用户名
   */
  public void logout(final String username) {
    deleteLoginCache(username);
  }

  private void deleteAccessTokenCache(final String username) {
    final String loggedInKey = LOGGED_IN_KEY_PREFIX + username;
    final String accessToken = stringRedisTemplate.opsForValue().get(loggedInKey);

    if (accessToken != null) {
      stringRedisTemplate.delete(ACCESS_TOKEN_KEY_PREFIX + accessToken);
    }
  }

  private void saveLoginCache(final CachedAuth auth) {
    AuthUtils.setAuthenticatedContext(auth, request);

    final String accessToken = auth.accessToken();

    stringRedisTemplate.opsForValue().set(
      LOGGED_IN_KEY_PREFIX + auth.username(),
      accessToken,
      TOKEN_EXPIRES_IN_SECONDS,
      TimeUnit.SECONDS
    );

    stringRedisTemplate.opsForValue().set(
      ACCESS_TOKEN_KEY_PREFIX + accessToken,
      jsonConverter.toJson(auth),
      TOKEN_EXPIRES_IN_SECONDS,
      TimeUnit.SECONDS
    );
  }

  private void deleteLoginCache(final String username) {
    final String loggedInKey = LOGGED_IN_KEY_PREFIX + username;
    final String accessToken = stringRedisTemplate.opsForValue().get(loggedInKey);

    if (accessToken == null) return;

    stringRedisTemplate.delete(List.of(
      ACCESS_TOKEN_KEY_PREFIX + accessToken,
      loggedInKey
    ));
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

  private static AuthResult getAuthResult(
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
