package net.wuxianjie.backend.shared.apicaller;

import org.springframework.http.HttpStatusCode;

/**
 * API 响应结果。
 *
 * @param status HTTP 状态码
 * @param data 响应数据
 * @param error 错误信息
 * @param <T> 响应数据的泛型类型参数
 */
public record ApiResponse<T>(HttpStatusCode status, T data, String error) {}
