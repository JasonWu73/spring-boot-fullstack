package net.wuxianjie.springbootdemo.redis.dto;

import java.time.LocalDateTime;

public record CachedUser(
  String username,
  String password,
  LocalDateTime createdAt
) {

}
