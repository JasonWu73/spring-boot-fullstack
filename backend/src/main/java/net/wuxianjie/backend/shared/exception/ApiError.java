package net.wuxianjie.backend.shared.exception;

import java.time.LocalDateTime;
import java.util.Objects;
import org.springframework.http.HttpStatus;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

/**
 * API 错误响应结果。
 * <p>
 * 为兼容 Spring Boot 的默认错误响应，故错误返回值字段应该与 Spring Boot 保持一致。
 *
 * @param timestamp 请求发起的时间戳
 * @param status HTTP 响应状态码
 * @param error 错误信息
 * @param path 请求地址
 */
public record ApiError(LocalDateTime timestamp, int status, String error, String path) {

  /**
   * 构造 API 错误响应结果。
   *
   * @param status HTTP 响应状态码
   * @param error 错误信息
   */
  public ApiError(final HttpStatus status, final String error) {
    this(LocalDateTime.now(), status.value(), error, getRequestPath());
  }

  /**
   * 构造 API 错误响应结果。
   *
   * @param status HTTP 响应状态码
   * @param error 错误信息
   * @param path 请求地址
   */
  public ApiError(final HttpStatus status, final String error, final String path) {
    this(LocalDateTime.now(), status.value(), error, path);
  }

  private static String getRequestPath() {
    final RequestAttributes attr = RequestContextHolder.getRequestAttributes();
    final ServletRequestAttributes reqAttr = (ServletRequestAttributes) attr;
    return Objects.requireNonNull(reqAttr).getRequest().getRequestURI();
  }
}
