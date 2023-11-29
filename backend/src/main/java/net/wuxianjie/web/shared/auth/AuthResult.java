package net.wuxianjie.web.shared.auth;

import java.util.List;

/**
 * 身份验证结果。
 *
 * @param accessToken      访问令牌，用于访问接口时的身份验证
 * @param refreshToken     刷新令牌，用于刷新访问令牌
 * @param expiresInSeconds 令牌在多少秒后过期
 * @param nickname         昵称
 * @param authorities      功能权限列表
 */
public record AuthResult(
  String accessToken,
  String refreshToken,
  int expiresInSeconds,
  String nickname,
  List<String> authorities
) {}
