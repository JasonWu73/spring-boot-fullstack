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

import java.util.Optional;

/**
 * 全局异常处理。
 */
@Slf4j
@ControllerAdvice
public class GlobalExceptionHandler {

  /**
   * 处理自定义 API 异常。
   *
   * @param e API 异常
   * @return 响应结果
   */
  @ExceptionHandler(ApiException.class)
  public ResponseEntity<ApiError> handleApiException(ApiException e) {
    writeLog(e);
    return ResponseEntity
      .status(e.getStatus())
      .body(new ApiError(e.getStatus(), e.getReason()));
  }

  /**
   * 处理所有未被特定 {@code handleXxxException(...)} 捕获的异常。
   *
   * @param e 超类异常
   * @return 响应结果
   */
  @ExceptionHandler(Throwable.class)
  public ResponseEntity<ApiError> handleFailedException(Throwable e) {
    // 不要处理 `org.springframework.security.access.AccessDeniedException`，否则会导致 Spring Security 无法处理 403
//    if (e instanceof AccessDeniedException springSecurity403Exc) {
//      throw springSecurity403Exc;
//    }

    HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;

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
   *
   * @param e 违反约束条件的异常
   * @return 响应结果
   */
  @ExceptionHandler(ConstraintViolationException.class)
  public ResponseEntity<ApiError> handleConstraintViolationException(ConstraintViolationException e) {
    StringBuilder sb = new StringBuilder();

    Optional.ofNullable(e.getConstraintViolations()).ifPresent(
      violations -> violations.forEach(v -> {
        if (!sb.isEmpty()) {
          sb.append(ApiException.MESSAGE_SEPARATOR);
        }

        sb.append(v.getMessage());
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
   *
   * @param e 参数校验失败的异常
   * @return 响应结果
   */
  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ApiError> handleMethodArgumentNotValidException(MethodArgumentNotValidException e) {
    StringBuilder sb = new StringBuilder();

    e.getBindingResult().getFieldErrors().forEach(error -> {
      if (!sb.isEmpty()) {
        sb.append(ApiException.MESSAGE_SEPARATOR);
      }

      if (error.isBindingFailure()) {
        String field = error.getField();
        Object rejectedValue = error.getRejectedValue();
        String reason = String.format("参数值不合法 [%s=%s]", field, rejectedValue);

        sb.append(reason);
        return;
      }

      sb.append(error.getDefaultMessage());
    });

    return handleApiException(new ApiException(HttpStatus.BAD_REQUEST, sb.toString(), e));
  }

  /**
   * 处理因缺少请求参数（{@code @RequestParam} 默认为必填参数）而产生的异常。
   *
   * @param e 缺少参数异常
   * @return 响应结果
   */
  @ExceptionHandler(MissingServletRequestParameterException.class)
  public ResponseEntity<ApiError> handleMissingServletRequestParameterException(MissingServletRequestParameterException e) {
    String reason = String.format("缺少必填参数 [%s]", e.getParameterName());

    return handleApiException(new ApiException(HttpStatus.BAD_REQUEST, reason, e));
  }

  /**
   * 处理因请求参数值不合法而产生的异常。
   *
   * @param e 方法参数类型不匹配的异常
   * @return 响应结果
   */
  @ExceptionHandler(MethodArgumentTypeMismatchException.class)
  public ResponseEntity<ApiError> handleMethodArgumentTypeMismatchException(MethodArgumentTypeMismatchException e) {
    String paramName = e.getName();
    Object paramValue = e.getValue();
    String reason = String.format("参数值不合法 [%s=%s]", paramName, paramValue);

    return handleApiException(new ApiException(HttpStatus.BAD_REQUEST, reason, e));
  }

  /**
   * 处理因请求体内容（如 JSON）不合法而产生的异常。
   *
   * @param e 请求体内容解析异常
   * @return 响应结果
   */
  @ExceptionHandler(HttpMessageNotReadableException.class)
  public ResponseEntity<ApiError> handleHttpMessageNotReadableException(HttpMessageNotReadableException e) {
    return handleApiException(new ApiException(HttpStatus.BAD_REQUEST, "无法解析请求体内容", e));
  }

  /**
   * 处理因不支持请求方法而产生的异常。
   *
   * @param e 请求方法不支持异常
   * @param req HTTP 请求对象
   * @return 响应结果
   */
  @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
  public ResponseEntity<ApiError> handleHttpRequestMethodNotSupportedException(
    HttpRequestMethodNotSupportedException e,
    HttpServletRequest req
  ) {
    String reason = String.format("不支持的请求方法 [%s]", req.getMethod());

    return handleApiException(new ApiException(HttpStatus.METHOD_NOT_ALLOWED, reason, e));
  }

  /**
   * 处理因不支持请求头中指定的 MIME Content-Type而产生的异常。
   *
   * @param e 不支持媒体类型的异常
   * @param req HTTP 请求对象
   * @return 响应结果
   */
  @ExceptionHandler(HttpMediaTypeException.class)
  public ResponseEntity<ApiError> handleHttpMediaTypeException(
    HttpMediaTypeException e,
    HttpServletRequest req
  ) {
    String reason = String.format("不支持的媒体类型 [%s: %s]", HttpHeaders.CONTENT_TYPE, req.getHeader(HttpHeaders.CONTENT_TYPE));

    return handleApiException(new ApiException(HttpStatus.NOT_ACCEPTABLE, reason, e));
  }

  /**
   * 处理网络连接因请求处理过程中被中断而产生的异常。
   */
  @ExceptionHandler(ClientAbortException.class)
  public ResponseEntity<String> handleClientAbortException() {
    return new ResponseEntity<>(HttpStatus.NO_CONTENT);
  }

  private void writeLog(ApiException e) {
    // 因为是已经识别了的异常，故不需要记录错误的堆栈信息
    // 以 WARN 级别记录客户端异常
    boolean isClientError = e.getStatus().is4xxClientError();
    if (isClientError) {
      log.warn("客户端异常: {}", e.getMessage());
      return;
    }

    // 以 ERROR 级别记录服务端异常
    log.error("服务端异常: {}", e.getMessage());
  }
}
