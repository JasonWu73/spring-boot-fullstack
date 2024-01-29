package net.wuxianjie.backend.shared.auth.dto;

import java.util.List;

/**
 * 身份验证结果。
 *
 * @param accessToken 访问令牌，用于访问接口时的身份验证
 * @param refreshToken 刷新令牌，用于刷新身份验证信息的令牌
 * @param expiresInSeconds 令牌过期时间，单位：秒
 * @param username 用户名
 * @param nickname 昵称
 * @param authorities 功能权限列表
 */
public record LoginResult(
  String accessToken,
  String refreshToken,
  int expiresInSeconds,
  String username,
  String nickname,
  List<String> authorities
) {}
