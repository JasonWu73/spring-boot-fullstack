package net.wuxianjie.web.demo.requestparam;

/**
 * 上传文件的返回结果。
 *
 * @param success  是否成功
 * @param filename 文件名
 * @param message  信息
 */
public record Uploaded(boolean success, String filename, String message) {}
