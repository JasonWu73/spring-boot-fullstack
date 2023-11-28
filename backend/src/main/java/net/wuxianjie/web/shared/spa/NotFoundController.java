package net.wuxianjie.web.shared.spa;

import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.wuxianjie.web.shared.exception.ApiError;
import net.wuxianjie.web.shared.exception.ApiException;
import org.springframework.boot.web.server.ErrorPage;
import org.springframework.boot.web.server.WebServerFactoryCustomizer;
import org.springframework.boot.web.servlet.server.ConfigurableServletWebServerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.RequestMapping;

import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.Optional;

/**
 * 兼容 SPA 单页面应用和 REST API 服务。
 */
@Slf4j
@Controller
@Configuration
@RequiredArgsConstructor
public class NotFoundController {

  private static final String NOT_FOUND_PATH = "/404";
  private static final String API_PATH_PREFIX = "/api/";
  public static final String SPA_INDEX_PAGE = "classpath:/static/index.html";

  private final ResourceLoader resourceLoader;

  @Bean
  public WebServerFactoryCustomizer<ConfigurableServletWebServerFactory>
  webServerFactoryCustomizer() {
    return factory -> factory.addErrorPages(
        new ErrorPage(HttpStatus.NOT_FOUND, NOT_FOUND_PATH)
    );
  }

  /**
   * 404 处理，按规则返回 JSON 数据或页面。
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
  @RequestMapping(NOT_FOUND_PATH)
  public ResponseEntity<?> handleNotFoundRequest(final HttpServletRequest request) {
    // 若为 API 或 JSON 请求，则返回 JSON 数据
    final String requestPath = getOriginalRequestPath(request);
    final String accept = Optional
        .ofNullable(request.getHeader(HttpHeaders.ACCEPT))
        .orElse("");

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

  private String getOriginalRequestPath(final HttpServletRequest request) {
    return Optional
        .ofNullable(request.getAttribute(RequestDispatcher.FORWARD_SERVLET_PATH))
        .map(Object::toString)
        .orElse("");

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
