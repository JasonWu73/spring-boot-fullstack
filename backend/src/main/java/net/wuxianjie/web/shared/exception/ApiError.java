package net.wuxianjie.web.shared.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.time.LocalDateTime;
import java.util.Objects;

/**
 * 为了兼容 Spring Boot 的默认错误响应，故错误返回值字段应该与 Spring Boot 保持一致。
 *
 * @param timestamp 请求时间
 * @param status    HTTP 响应状态码
 * @param error     错误信息
 * @param path      请求地址
 */
public record ApiError(LocalDateTime timestamp, int status, String error, String path) {

  public ApiError(final HttpStatus status, final String error) {
    this(LocalDateTime.now(), status.value(), error, getRequestPath());
  }

  public ApiError(final HttpStatus status, final String error, final String path) {
    this(LocalDateTime.now(), status.value(), error, path);
  }

  private static String getRequestPath() {
    final ServletRequestAttributes requestAttributes =
        (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
    return Objects.requireNonNull(requestAttributes).getRequest().getRequestURI();
  }
}
