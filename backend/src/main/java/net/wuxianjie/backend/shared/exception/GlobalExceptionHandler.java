package net.wuxianjie.backend.shared.exception;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Valid;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.wuxianjie.backend.shared.auth.SecurityConfig;
import org.apache.catalina.connector.ClientAbortException;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.util.FileCopyUtils;
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
import org.springframework.web.servlet.NoHandlerFoundException;
import org.springframework.web.servlet.mvc.support.DefaultHandlerExceptionResolver;
import org.springframework.web.servlet.resource.NoResourceFoundException;

/**
 * 全局异常处理器。
 */
@ControllerAdvice
@RequiredArgsConstructor
@Slf4j
public class GlobalExceptionHandler {

  private static final String SPA_INDEX_PAGE_PATH = "classpath:/static/index.html";

  private final ResourceLoader resourceLoader;

  /**
   * Spring Boot 404 处理：配置单页应用（SPA），按规则返回 JSON 数据或页面。
   * <p>
   * 由 {@link DefaultHandlerExceptionResolver} 可知 Spring 中默认对应 404 的异常有哪些。
   * <p>
   * <h3>返回 JSON 数据</h3>
   *
   * <ol>
   *   <li>请求头 {@value HttpHeaders#ACCEPT} 中明确指定了 {@value MediaType#APPLICATION_JSON_VALUE}</li>
   *   <li>请求 URI 以 {@value SecurityConfig#API_PATH_PREFIX} 开头</li>
   * </ol>
   *
   * <h3>返回页面</h3>
   *
   * <ol>
   *   <li>非上述返回 JSON 数据的情况下，都一律返回页面，因为前端 SPA（单页面应用）已作为静态资源打包在了 Jar 中</li>
   *   <li>Spring Boot 默认会将 `src/main/resources/static/` 中的内容作为 Web 静态资源提供</li>
   *   <li>我们约定 SPA 的页面入口地址为 {@value #SPA_INDEX_PAGE_PATH}</li>
   * </ol>
   *
   * @param request HTTP 请求对象
   * @return JSON 数据或 SPA 首页
   */
  @ExceptionHandler({ NoResourceFoundException.class, NoHandlerFoundException.class })
  public ResponseEntity<?> handleNoResourceFoundException(final HttpServletRequest request) {
    final String requestPath = request.getRequestURI();
    final String accept = request.getHeader(HttpHeaders.ACCEPT);
    if (isJsonRequest(requestPath, accept)) {
      return ResponseEntity
        .status(HttpStatus.NOT_FOUND)
        .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
        .body(new ApiError(HttpStatus.NOT_FOUND, "未找到请求的资源", requestPath));
    }

    return ResponseEntity
      .status(HttpStatus.OK)
      .header(HttpHeaders.CONTENT_TYPE, MediaType.TEXT_HTML_VALUE)
      .body(getIndexHtml());
  }

  /**
   * 处理自定义 API 异常。
   *
   * @param e 自定义 API 异常
   * @return API 错误信息
   */
  @ExceptionHandler(ApiException.class)
  public ResponseEntity<ApiError> handleApiException(final ApiException e) {
    logToFile(e);

    return ResponseEntity
      .status(e.getStatus())
      .body(new ApiError(e.getStatus(), e.getReason()));
  }

  /**
   * 处理所有未被特定 `handleXxxException(...)` 捕获的异常。
   *
   * @param e 异常基类
   * @return API 错误信息
   */
  @ExceptionHandler(Throwable.class)
  public ResponseEntity<ApiError> handleDefaultException(final Throwable e) {
    // 不要处理 `org.springframework.security.access.AccessDeniedException`，
    // 而是由 Spring Security 框架自己处理 403
    if (e instanceof AccessDeniedException ex) throw ex;

    log.error("服务异常: {}", e.getMessage(), e);

    return ResponseEntity
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .body(new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, "服务异常"));
  }

  /**
   * 处理因请求参数不合法而产生的异常。
   * <p>
   * <h3>触发本异常的验证方式</h3>
   *
   * <ul>
   *   <li>Controller 类必须有 {@link Validated} 注解</li>
   *   <li>直接对 Controller 方法参数使用验证注解，如 `@NotBlank`</li>
   * </ul>
   *
   * @param e {@link ConstraintViolationException}
   * @return API 错误信息
   */
  @ExceptionHandler(ConstraintViolationException.class)
  public ResponseEntity<ApiError> handleConstraintViolationException(
    final ConstraintViolationException e
  ) {
    final StringBuilder stringBuilder = new StringBuilder();
    Optional
      .ofNullable(e.getConstraintViolations())
      .ifPresent(violations -> violations.forEach(violation -> {
        if (!stringBuilder.isEmpty()) {
          stringBuilder.append(ApiException.MESSAGE_SEPARATOR);
        }
        stringBuilder.append(violation.getMessage());
      }));
    return handleApiException(
      new ApiException(HttpStatus.BAD_REQUEST, stringBuilder.toString(), e)
    );
  }

  /**
   * 处理因请求参数不合法而产生的异常。
   * <p>
   * <h3>触发本异常的验证方式</h3>
   *
   * <ul>
   *   <li>对方法参数使用 {@link Valid} 注解</li>
   *   <li>方法参数是 POJO 类，包含在嵌套类的字段上再次使用 {@link Valid} 注解</li>
   * </ul>
   *
   * @param e {@link MethodArgumentNotValidException}
   * @return API 错误信息
   */
  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ApiError> handleMethodArgumentNotValidException(
    final MethodArgumentNotValidException e
  ) {
    final StringBuilder stringBuilder = new StringBuilder();
    e
      .getBindingResult()
      .getFieldErrors()
      .forEach(error -> {
        if (!stringBuilder.isEmpty()) {
          stringBuilder.append(ApiException.MESSAGE_SEPARATOR);
        }
        if (error.isBindingFailure()) {
          final String field = error.getField();
          final Object rejectedValue = error.getRejectedValue();
          final String reason = "参数值不合法 [%s=%s]".formatted(field, rejectedValue);
          stringBuilder.append(reason);
          return;
        }

        stringBuilder.append(error.getDefaultMessage());
      });
    return handleApiException(
      new ApiException(HttpStatus.BAD_REQUEST, stringBuilder.toString(), e)
    );
  }

  /**
   * 处理因缺少请求参数（`@RequestParam` 默认参数为必填）而产生的异常。
   * <p>
   * 因为 `@RequestParam` 可用于 Multi-Part 请求，故还需要处理 {@link MissingServletRequestPartException}。
   *
   * @param e {@link MissingServletRequestParameterException} 或 {@link MissingServletRequestPartException}
   * @return API 错误信息
   */
  @ExceptionHandler({
    MissingServletRequestParameterException.class,
    MissingServletRequestPartException.class,
  })
  public ResponseEntity<ApiError> handleMissingServletRequestParameterException(final Exception e) {
    final String paramName = getParameterName(e);
    String reason = "缺少必填参数 [%s]".formatted(paramName);
    return handleApiException(
      new ApiException(HttpStatus.BAD_REQUEST, reason, e)
    );
  }

  /**
   * 处理因请求参数值不合法而产生的异常。
   *
   * @param e {@link MethodArgumentTypeMismatchException}
   * @return API 错误信息
   */
  @ExceptionHandler(MethodArgumentTypeMismatchException.class)
  public ResponseEntity<ApiError> handleMethodArgumentTypeMismatchException(
    final MethodArgumentTypeMismatchException e
  ) {
    final String paramName = e.getName();
    final Object paramValue = e.getValue();
    final String reason = "参数值不合法 [%s=%s]".formatted(paramName, paramValue);
    return handleApiException(
      new ApiException(HttpStatus.BAD_REQUEST, reason, e)
    );
  }

  /**
   * 处理因无法解析请求体内容（如错误的 JSON 数据格式）而产生的异常。
   *
   * @param e {@link HttpMessageNotReadableException}
   * @return API 错误信息
   */
  @ExceptionHandler(HttpMessageNotReadableException.class)
  public ResponseEntity<ApiError> handleHttpMessageNotReadableException(
    final HttpMessageNotReadableException e
  ) {
    return handleApiException(
      new ApiException(HttpStatus.BAD_REQUEST, "请求体内容不合法", e)
    );
  }

  /**
   * 处理因不支持请求方法而产生的异常。
   *
   * @param e {@link HttpRequestMethodNotSupportedException}
   * @param request HTTP 请求对象
   * @return API 错误信息
   */
  @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
  public ResponseEntity<ApiError> handleHttpRequestMethodNotSupportedException(
    final HttpRequestMethodNotSupportedException e,
    final HttpServletRequest request
  ) {
    final String reason = "不支持的请求方法 [%s]".formatted(request.getMethod());
    return handleApiException(
      new ApiException(HttpStatus.METHOD_NOT_ALLOWED, reason, e)
    );
  }

  /**
   * 处理因不支持请求头中指定的 MIME Content-Type 而产生的异常。
   *
   * @param e {@link HttpMediaTypeException}
   * @param request HTTP 请求对象
   * @return API 错误信息
   */
  @ExceptionHandler(HttpMediaTypeException.class)
  public ResponseEntity<ApiError> handleHttpMediaTypeException(
    final HttpMediaTypeException e,
    final HttpServletRequest request
  ) {
    final String reason = "不支持的媒体类型 [%s: %s]".formatted(
      HttpHeaders.CONTENT_TYPE,
      request.getHeader(HttpHeaders.CONTENT_TYPE)
    );
    return handleApiException(
      new ApiException(HttpStatus.NOT_ACCEPTABLE, reason, e)
    );
  }

  /**
   * 处理因非 Multi-Part 请求而产生的异常。
   *
   * @param e {@link MultipartException}
   * @return API 错误信息
   */
  @ExceptionHandler(MultipartException.class)
  public ResponseEntity<ApiError> handleMultipartException(final MultipartException e) {
    return handleApiException(
      new ApiException(HttpStatus.NOT_ACCEPTABLE, "仅支持 Multipart 请求", e)
    );
  }

  /**
   * 客户端在服务器响应未完全发送之前关闭了连接而产生的异常。
   */
  @ExceptionHandler(ClientAbortException.class)
  public void handleClientAbortException() {}

  private static boolean isJsonRequest(final String requestPath, final String accept) {
    return (
      requestPath.startsWith(SecurityConfig.API_PATH_PREFIX) ||
      accept.contains(MediaType.APPLICATION_JSON_VALUE)
    );
  }

  private String getIndexHtml() {
    final Resource resource = resourceLoader.getResource(SPA_INDEX_PAGE_PATH);
    if (!resource.exists()) {
      throw new ApiException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        "未找到 SPA 首页文件 [%s]".formatted(SPA_INDEX_PAGE_PATH)
      );
    }

    try (
      final InputStreamReader reader = new InputStreamReader(
        resource.getInputStream(),
        StandardCharsets.UTF_8
      )
    ) {
      return FileCopyUtils.copyToString(reader);
    } catch (IOException e) {
      throw new RuntimeException(e);
    }
  }

  private void logToFile(final ApiException e) {
    // ----- 已经识别的异常，故无需记录异常的堆栈信息 -----
    final boolean isClientError = e.getStatus().is4xxClientError();
    if (isClientError) {
      log.warn("客户端异常: {}", e.getMessage());
      return;
    }

    log.error("服务端异常: {}", e.getMessage());
  }

  private String getParameterName(final Exception e) {
    if (e instanceof MissingServletRequestParameterException ex) {
      return ex.getParameterName();
    }

    if (e instanceof MissingServletRequestPartException ex) {
      return ex.getRequestPartName();
    }

    return "未知参数";
  }
}
