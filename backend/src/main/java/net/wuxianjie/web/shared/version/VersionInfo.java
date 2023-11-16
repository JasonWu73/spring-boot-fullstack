package net.wuxianjie.web.shared.version;

import java.time.LocalDateTime;

/**
 * 项目版本信息。
 *
 * @param name    项目名称
 * @param version 项目版本号
 * @param builtAt 构建时间
 */
public record VersionInfo(String name, String version, LocalDateTime builtAt) {}
