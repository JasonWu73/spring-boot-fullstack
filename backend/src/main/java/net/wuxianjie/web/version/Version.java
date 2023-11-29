package net.wuxianjie.web.version;

import java.time.LocalDateTime;

/**
 * 项目版本信息。
 *
 * @param name      项目名称
 * @param developer 项目开发者
 * @param version   项目版本号
 * @param builtAt   构建时间
 */
public record Version(
  String name,
  String developer,
  String version,
  LocalDateTime builtAt
) {}
