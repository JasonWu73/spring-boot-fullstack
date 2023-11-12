package net.wuxianjie.web.shared.exception;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.apache.catalina.connector.ClientAbortException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.HttpMediaTypeException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.multipart.MultipartException;
import org.springframework.web.multipart.support.MissingServletRequestPartException;

import java.util.Optional;

@Slf4j
@ControllerAdvice
public class GlobalExceptionHandler {

  /**
   * 处理自定义 API 异常。
   */
  @ExceptionHandler(ApiException.class)
  public ResponseEntity<ApiError> handleApiException(final ApiException e) {
    writeToLog(e);

    return ResponseEntity
      .status(e.getStatus())
      .body(new ApiError(e.getStatus(), e.getReason()));
  }

  /**
   * 处理所有未被特定 {@code handleXxxException(...)} 捕获的异常。
   */
  @ExceptionHandler(Throwable.class)
  public ResponseEntity<ApiError> handleFailedException(final Throwable e) {
    // 不要处理 `org.springframework.security.access.AccessDeniedException`，否则会导致 Spring Security 无法处理 403
   /*
   if (e instanceof AccessDeniedException springSecurity403Exc) {
     throw springSecurity403Exc;
   }
   */

    final HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;
    log.error("落空的服务异常: {}", e.getMessage(), e);

    return ResponseEntity
      .status(status)
      .body(new ApiError(status, "服务异常"));
  }

  /**
   * 处理因请求参数不合法而产生的异常。
   *
   * <p>触发本异常的校验方式：
   *
   * <ul>
   *   <li>Controller 类必须有 {@link Validated} 注解</li>
   *   <li>直接对 Controller 方法参数使用校验注解，如 {@code @NotBlank}</li>
   * </ul>
   */
  @ExceptionHandler(ConstraintViolationException.class)
  public ResponseEntity<ApiError> handleConstraintViolationException(
    final ConstraintViolationException e
  ) {
    final StringBuilder sb = new StringBuilder();
    Optional.ofNullable(e.getConstraintViolations()).ifPresent(
      violations -> violations.forEach(violation -> {
        if (!sb.isEmpty()) {
          sb.append(ApiException.MESSAGE_SEPARATOR);
        }

        sb.append(violation.getMessage());
      })
    );

    return handleApiException(new ApiException(HttpStatus.BAD_REQUEST, sb.toString(), e));
  }

  /**
   * 处理因请求参数不合法而产生的异常。
   *
   * <p>触发本异常的校验方式：
   *
   * <ul>
   *   <li>对方法参数使用 {@link Valid} 注解</li>
   *   <li>方法参数是 POJO 类，且还可在嵌套属性上使用 {@link Valid}</li>
   * </ul>
   */
  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ApiError> handleMethodArgumentNotValidException(
    final MethodArgumentNotValidException e
  ) {
    final StringBuilder sb = new StringBuilder();
    e.getBindingResult().getFieldErrors().forEach(error -> {
      if (!sb.isEmpty()) {
        sb.append(ApiException.MESSAGE_SEPARATOR);
      }

      if (error.isBindingFailure()) {
        final String field = error.getField();
        final Object rejectedValue = error.getRejectedValue();
        final String reason = "参数值不合法 [%s=%s]".formatted(field, rejectedValue);
        sb.append(reason);
        return;
      }

      sb.append(error.getDefaultMessage());
    });

    return handleApiException(new ApiException(HttpStatus.BAD_REQUEST, sb.toString(), e));
  }

  /**
   * 处理因缺少请求参数（{@code @RequestParam} 默认为必填参数）而产生的异常。
   */
  @ExceptionHandler({
    MissingServletRequestParameterException.class,
    MissingServletRequestPartException.class
  })
  public ResponseEntity<ApiError> handleMissingServletRequestParameterException(final Exception e) {
    String paramName = getParamName(e);
    String reason = "缺少必填参数 [%s]".formatted(paramName);
    return handleApiException(new ApiException(HttpStatus.BAD_REQUEST, reason, e));
  }

  /**
   * 处理因请求参数值不合法而产生的异常。
   */
  @ExceptionHandler(MethodArgumentTypeMismatchException.class)
  public ResponseEntity<ApiError> handleMethodArgumentTypeMismatchException(
    final MethodArgumentTypeMismatchException e
  ) {
    final String paramName = e.getName();
    final Object paramValue = e.getValue();
    final String reason = "参数值不合法 [%s=%s]".formatted(paramName, paramValue);
    return handleApiException(new ApiException(HttpStatus.BAD_REQUEST, reason, e));
  }

  /**
   * 处理因请求体内容（如 JSON）不合法而产生的异常。
   */
  @ExceptionHandler(HttpMessageNotReadableException.class)
  public ResponseEntity<ApiError> handleHttpMessageNotReadableException(
    final HttpMessageNotReadableException e
  ) {
    return handleApiException(new ApiException(HttpStatus.BAD_REQUEST, "无法解析请求体内容", e));
  }

  /**
   * 处理因不支持请求方法而产生的异常。
   */
  @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
  public ResponseEntity<ApiError> handleHttpRequestMethodNotSupportedException(
    final HttpRequestMethodNotSupportedException e,
    final HttpServletRequest req
  ) {
    final String reason = "不支持的请求方法 [%s]".formatted(req.getMethod());
    return handleApiException(new ApiException(HttpStatus.METHOD_NOT_ALLOWED, reason, e));
  }

  /**
   * 处理因不支持请求头中指定的 MIME Content-Type 而产生的异常。
   */
  @ExceptionHandler(HttpMediaTypeException.class)
  public ResponseEntity<ApiError> handleHttpMediaTypeException(
    final HttpMediaTypeException e,
    final HttpServletRequest req
  ) {
    final String reason = "不支持的媒体类型 [%s: %s]".formatted(
      HttpHeaders.CONTENT_TYPE,
      req.getHeader(HttpHeaders.CONTENT_TYPE)
    );
    return handleApiException(new ApiException(HttpStatus.NOT_ACCEPTABLE, reason, e));
  }

  /**
   * 处理因非 Multipart 请求而产生的异常。
   */
  @ExceptionHandler(MultipartException.class)
  public ResponseEntity<ApiError> handleMultipartException(final MultipartException e) {
    return handleApiException(
      new ApiException(HttpStatus.NOT_ACCEPTABLE, "仅支持 Multipart 请求", e)
    );
  }

  /**
   * 处理网络连接因请求处理过程中被中断而产生的异常。
   */
  @ExceptionHandler(ClientAbortException.class)
  public ResponseEntity<String> handleClientAbortException() {
    return new ResponseEntity<>(HttpStatus.NO_CONTENT);
  }

  private void writeToLog(final ApiException e) {
    // 因为是已经识别了的异常，故不需要记录错误的堆栈信息
    // 以 WARN 级别记录客户端异常
    final boolean isClientError = e.getStatus().is4xxClientError();
    if (isClientError) {
      log.warn("客户端异常: {}", e.getMessage());
      return;
    }

    // 以 ERROR 级别记录服务端异常
    log.error("服务端异常: {}", e.getMessage());
  }

  private String getParamName(final Exception e) {
    if (e instanceof MissingServletRequestParameterException ex) return ex.getParameterName();

    if (e instanceof MissingServletRequestPartException ex) return ex.getRequestPartName();

    return "";
  }
}
