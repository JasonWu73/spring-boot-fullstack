package net.wuxianjie.backend.version;

/**
 * 项目版本号信息。
 *
 * @param version 版本号
 * @param appName 应用名
 * @param developer 开发者
 */
public record Version(String version, String appName, String developer) {}
