package net.wuxianjie.backend.user;

import java.util.List;
import java.util.Objects;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import net.wuxianjie.backend.shared.auth.AuthService;
import net.wuxianjie.backend.shared.auth.AuthUtils;
import net.wuxianjie.backend.shared.auth.TokenAuth;
import net.wuxianjie.backend.shared.auth.dto.AuthenticatedUser;
import net.wuxianjie.backend.shared.auth.dto.LoginParam;
import net.wuxianjie.backend.shared.auth.dto.LoginResult;
import net.wuxianjie.backend.shared.exception.ApiException;
import net.wuxianjie.backend.shared.json.JsonConverter;
import net.wuxianjie.backend.shared.oplog.OpLogAspect;
import net.wuxianjie.backend.shared.util.RsaUtils;
import net.wuxianjie.backend.shared.util.StrUtils;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * 身份验证业务处理。
 */
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

  // 公钥用于加密，分配给前端对用户名和密码进行加密传输
  // public static final String PUBLIC_KEY = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArbGWjwR4QAjBiJwMi5QNe+X8oPEFBfX3z5K6dSv9tU2kF9SVkf8uGGJwXeihQQ0o9aUk42zO58VL3MqDOaWHU6wm52pN9ZBbH0XJefqxtgyXrYAm279MU6EY4sywkUT9KOOgk/qDHB93IoEDL1fosYc7TRsAONuMGiyTJojn1FCPtJbbj7J56yCaFhUpuDunBFETQ32usRaK4KCWx9w0HZ6WmbX8QdcJkVjJ2FCLuGkvbKmUQ5h/GXXnNgbxIn3z2lX7snGRMhIFvW0Qjkn8YmOq6HUj7TU0jKm9VhZirVQXh8trvi2ivY7s6yJoF8N72Ekn94WSpSRVeC0XpXf2LQIDAQAB";

  /**
   * 私钥用于后端解密由前端传入的用户名和密码，不要泄露。
   */
  public static final String PRIVATE_KEY =
    "MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCtsZaPBHhACMGInAyLlA175fyg8QUF9ffPkrp1K/21TaQX1JWR/y4YYnBd6KFBDSj1pSTjbM7nxUvcyoM5pYdTrCbnak31kFsfRcl5+rG2DJetgCbbv0xToRjizLCRRP0o46CT+oMcH3cigQMvV+ixhztNGwA424waLJMmiOfUUI+0ltuPsnnrIJoWFSm4O6cEURNDfa6xForgoJbH3DQdnpaZtfxB1wmRWMnYUIu4aS9sqZRDmH8Zdec2BvEiffPaVfuycZEyEgW9bRCOSfxiY6rodSPtNTSMqb1WFmKtVBeHy2u+LaK9juzrImgXw3vYSSf3hZKlJFV4LReld/YtAgMBAAECggEARUFg6cd7dvTGzgSCkAjJU5SBJV7UhOrtEyvLArs2ntrFSecueBcKNxjQ+vCtkzV/FmrxiWiyGwG03OU2a37PtZIXtP/S883KN27pBaTqxM7Cj6BgXhApi9LZDF1XLaUXV/1i4n3pVwZIx04vieoAUwC7qWPRs9n+Q9VwGtZNsX6Baxu1Le5qfg/zbRofODpLQa0XuLA8M5+ieBzwNrjrHvYQQ0GGaNxqvyoZaxx9SCBtvGwE8T0vHF+lXTYaotbazrtGT3OneWza4Qa0HRjgZKBHKyOzsZWpjiw8ISQxzpG0hD6o7+YeYpC3zt7ZLwuZOZOG0QPvzBioPvhDJP75tQKBgQDJtFlkeRanpF054rKLm32Udm4B1E43U/fjwgAM+X3jUN3PaXmpNKUFQTtB+symi20eTpw6HDumRNCi5q644wyjdF2nVDHi6lcAl63NLT0x7+431IHlrqd4UGnzh+T8pN3yiNvqlUrDYpXoKtSeRCJfbUCvLjwi8LHwzbbN7nOLRwKBgQDccv0bc+DL5N6JmfjMn7/851QKc4ugMrsJwZe/VE8Sxwop5dTBiTb1UXMAhUG+UMt03qtXav0b+3F5SFhZO/M+GhpVdVIPbyjPTjE/XUc+VBUIED+NT7vWbv+lTwcEpTwMdxTqrO1GHfURGWO0CiaPbkS6YVrn5sI71iQXe/YE6wKBgQDIBV64chPzPt1sL9Da/OD1vtOsYLsHxu8GHzYpp6gdKe4sZu5My3Xx1hRLg8g6R/13loD6Z1EHuyoiwRv3IMFBvn25F5c47SZF4iRqWThcMxBKsSP3ftF4UFYhOFvt5hhrESj0YgP36eW6i+6429wyQYdpsTHVfFcY8wcbBCH0tQKBgCp6LbMgfOxMyWSSOpKTJZdBq7vnz7uqiseyed7wC9x+ZcL0+i3glqpma1ZqVuSpBMscLL/HacX+iTrpabyoBJKuzOwykwFOVfq8AllHS/cClJrdJqG//12uPaxIsf1/KTbtqyYc9AtSsmn9Dm0el5eDk9Kl97I/kKWe+Y1c4WbJAoGBAKzMJSbxfDXpnwb48RWUAQK/o5b7Jyz2ZBmL9+UsoUG9hoqC9NngBOGR5NGE+xGJRfwBPyXZim4fL9hr7Xurw0cd39d86DikL+3l804thbSiegAQtHhn6Ko/UMjVTkPmjsdvY5OaWO2SQGhhzbfhaMqgiaUBOsQP4DAoJd5faQlu";

  private final PasswordEncoder passwordEncoder;

  private final JsonConverter jsonConverter;
  private final TokenAuth tokenAuth;
  private final UserMapper userMapper;

  @Override
  public LoginResult login(final LoginParam param) {
    // ----- 使用私钥解密传入的用户名和密码 -----
    final String username;
    final String password;
    try {
      username = RsaUtils.decrypt(param.getUsername(), PRIVATE_KEY);
      password = RsaUtils.decrypt(param.getPassword(), PRIVATE_KEY);
    } catch (Exception e) {
      throw new ApiException(HttpStatus.UNAUTHORIZED, "用户名或密码错误", e);
    }

    // ----- 判断用户账号是否可用 -----
    final User user = Optional
      .ofNullable(userMapper.selectByUsername(username))
      .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "用户名或密码错误"));

    checkUserBanned(user.getStatus());

    if (!passwordEncoder.matches(password, user.getHashedPassword())) {
      throw new ApiException(HttpStatus.UNAUTHORIZED, "用户名或密码错误");
    }

    // ----- 删除旧的登录缓存 -----
    tokenAuth.deleteLoginCache(username);

    // ----- 保存新的登录信息至系统缓存 -----
    final String accessToken = StrUtils.generateUuid();
    final String refreshToken = StrUtils.generateUuid();
    final AuthenticatedUser loggedIn = getAuthenticatedUser(user, accessToken, refreshToken);
    tokenAuth.saveLoginCache(loggedIn);

    return getLoginResult(accessToken, refreshToken, loggedIn);
  }

  @Override
  public LoginResult refresh(final String refreshToken) {
    // ----- 从 Spring Security Context 中获取当前登录信息 -----
    final AuthenticatedUser loggedIn = AuthUtils.getCurrentUser().orElseThrow();
    if (!Objects.equals(loggedIn.refreshToken(), refreshToken)) {
      throw new ApiException(HttpStatus.UNAUTHORIZED, "无效的刷新令牌");
    }

    // ----- 删除旧的登录缓存 -----
    tokenAuth.deleteLoginCache(loggedIn.username());

    // ----- 判断用户账号是否可用 -----
    final User user = Optional
      .ofNullable(userMapper.selectById(loggedIn.userId()))
      .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "用户不存在"));

    checkUserBanned(user.getStatus());

    // ----- 保存新的登录信息至系统缓存 -----
    final String newAccessToken = StrUtils.generateUuid();
    final String newRefreshToken = StrUtils.generateUuid();
    final AuthenticatedUser newAuth = getAuthenticatedUser(user, newAccessToken, newRefreshToken);
    tokenAuth.saveLoginCache(newAuth);

    return getLoginResult(newAccessToken, newRefreshToken, newAuth);
  }

  @Override
  public void logout(final String username) {
    tokenAuth.deleteLoginCache(username);
  }

  private void checkUserBanned(final AccountStatus status) {
    if (status == AccountStatus.DISABLED) {
      throw new ApiException(HttpStatus.FORBIDDEN, "账号已被禁用");
    }
  }

  private AuthenticatedUser getAuthenticatedUser(
    final User user,
    final String accessToken,
    final String refreshToken
  ) {
    return new AuthenticatedUser(
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

  private static LoginResult getLoginResult(
    final String accessToken,
    final String refreshToken,
    final AuthenticatedUser auth
  ) {
    return new LoginResult(
      accessToken,
      refreshToken,
      TokenAuth.TOKEN_EXPIRES_IN_SECONDS,
      auth.nickname(),
      auth.authorities()
    );
  }
}
