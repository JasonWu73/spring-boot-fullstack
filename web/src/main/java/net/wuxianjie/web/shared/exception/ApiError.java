package net.wuxianjie.web.shared.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.time.LocalDateTime;
import java.util.Objects;

/**
 * 与 Spring Boot 默认错误响应字段保持一致的错误响应结果。
 *
 * @param timestamp 请求时间
 * @param status HTTP 响应状态码
 * @param error 错误信息
 * @param path 请求地址
 */
public record ApiError(LocalDateTime timestamp, int status, String error, String path) {

  /**
   * 构造错误响应结果。
   *
   * @param status HTTP 响应状态码
   * @param error 错误信息
   */
  public ApiError(HttpStatus status, String error) {
    this(LocalDateTime.now(), status.value(), error, getRequestPath());
  }

  private static String getRequestPath() {
    ServletRequestAttributes sra = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
    return Objects.requireNonNull(sra).getRequest().getRequestURI();
  }
}
