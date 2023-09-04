package net.wuxianjie.springbootdemo.redis.dto;

import java.time.LocalDateTime;

public record User(String id, String username, String password, LocalDateTime createdAt) {
}
