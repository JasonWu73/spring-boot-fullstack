package net.wuxianjie.web.shared.exception;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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

import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.Optional;

@Slf4j
@ControllerAdvice
@RequiredArgsConstructor
public class GlobalExceptionHandler {

  private static final String API_PATH_PREFIX = "/api/";
  public static final String SPA_INDEX_PAGE = "classpath:/static/index.html";

  private final ResourceLoader resourceLoader;

  /**
   * 单页应用（SPA）处理，按规则返回 JSON 数据或页面。
   *
   * <p>由 {@link DefaultHandlerExceptionResolver} 可知 Spring 中默认对应 404 的异常有哪些。
   *
   * <p>返回 JSON 数据：
   *
   * <ol>
   *   <li>请求头 {@value HttpHeaders#ACCEPT} 中存在 {@value MediaType#APPLICATION_JSON_VALUE}</li>
   *   <li>请求 URI 以 {@value #API_PATH_PREFIX} 开头</li>
   * </ol>
   *
   * <p>其他情况一律返回页面，因为前端 SPA 单页面应用已作为静态资源打包在了 Jar 中。
   *
   * <p>Spring Boot 默认会将 {@code src/main/resources/static/} 中的内容作为 Web 静态资源提供。
   *
   * <p>约定 SPA 的页面入口：{@value #SPA_INDEX_PAGE}。
   *
   * <p><h2>扩展说明
   *
   * <p>Spring Boot Web 静态资源查找目录，由优先级高到低排序：
   *
   * <ol>
   *   <li>{@code src/main/resources/META-INF/resources/}</li>
   *   <li>{@code src/main/resources/resources/}</li>
   *   <li>{@code src/main/resources/static/}</li>
   *   <li>{@code src/main/resources/public/}</li>
   * </ol>
   *
   * @return JSON 数据或 SPA 首页
   */
  @ExceptionHandler({NoResourceFoundException.class, NoHandlerFoundException.class})
  public ResponseEntity<?> handleNoResourceFoundException(
      final HttpServletRequest request
  ) {
    // 若为 API 或 JSON 请求，则返回 JSON 数据
    final String requestPath = request.getRequestURI();
    final String accept = request.getHeader(HttpHeaders.ACCEPT);

    if (isJsonRequest(requestPath, accept)) {
      return ResponseEntity
          .status(HttpStatus.NOT_FOUND)
          .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
          .body(new ApiError(HttpStatus.NOT_FOUND, "未找到请求的资源", requestPath));
    }

    // 其他情况，返回 SPA 首页内容，由前端处理 404
    return ResponseEntity
        .status(HttpStatus.OK)
        .header(HttpHeaders.CONTENT_TYPE, MediaType.TEXT_HTML_VALUE)
        .body(getIndexHtml());
  }

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
    // 不要处理 `org.springframework.security.access.AccessDeniedException`
    // 否则会导致 Spring Security 无法处理 403
    if (e instanceof AccessDeniedException springSecurity403Exception) {
      throw springSecurity403Exception;
    }

    log.error("落空的服务异常: {}", e.getMessage(), e);

    return ResponseEntity
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .body(new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, "服务异常"));
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
    final StringBuilder stringBuilder = new StringBuilder();

    Optional
        .ofNullable(e.getConstraintViolations())
        .ifPresent(violations -> violations.forEach(violation -> {
              if (!stringBuilder.isEmpty()) {
                stringBuilder.append(ApiException.MESSAGE_SEPARATOR);
              }

              stringBuilder.append(violation.getMessage());
            })
        );

    return handleApiException(
        new ApiException(HttpStatus.BAD_REQUEST, stringBuilder.toString(), e)
    );
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
   * 处理因缺少请求参数（{@code @RequestParam} 默认为必填参数）而产生的异常。
   */
  @ExceptionHandler({
      MissingServletRequestParameterException.class,
      MissingServletRequestPartException.class
  })
  public ResponseEntity<ApiError> handleMissingServletRequestParameterException(
      final Exception e
  ) {
    final String paramName;

    if (e instanceof MissingServletRequestParameterException ex) {
      paramName = ex.getParameterName();
    } else if (e instanceof MissingServletRequestPartException ex) {
      paramName = ex.getRequestPartName();
    } else {
      paramName = "未知参数";
    }

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
    return handleApiException(
        new ApiException(HttpStatus.BAD_REQUEST, "无法解析请求体内容", e)
    );
  }

  /**
   * 处理因不支持请求方法而产生的异常。
   */
  @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
  public ResponseEntity<ApiError> handleHttpRequestMethodNotSupportedException(
      final HttpRequestMethodNotSupportedException e,
      final HttpServletRequest request
  ) {
    final String reason = "不支持的请求方法 [%s]".formatted(request.getMethod());

    return handleApiException(new ApiException(HttpStatus.METHOD_NOT_ALLOWED, reason, e));
  }

  /**
   * 处理因不支持请求头中指定的 MIME Content-Type 而产生的异常。
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

  private static boolean isJsonRequest(final String originalPath, final String accept) {
    return originalPath.startsWith(API_PATH_PREFIX)
        || accept.contains(MediaType.APPLICATION_JSON_VALUE);
  }

  private String getIndexHtml() {
    final Resource resource = resourceLoader.getResource(SPA_INDEX_PAGE);

    if (!resource.exists()) {
      throw new ApiException(
          HttpStatus.INTERNAL_SERVER_ERROR,
          "未找到 SPA 首页文件 [%s]".formatted(SPA_INDEX_PAGE)
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
}
