package net.wuxianjie.web.shared.spa;

import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.wuxianjie.web.shared.exception.ApiError;
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

/**
 * 兼容 SPA 单页面应用和 REST API 服务.
 */
@Slf4j
@Controller
@Configuration
@RequiredArgsConstructor
public class NotFoundController {

  /**
   * 处理 "404 未找到" 请求的 URI.
   */
  public static final String URI_NOT_FOUND = "/404";

  /**
   * 处理 REST API 请求的 URI 前缀.
   */
  public static final String URI_PREFIX_API = "/api/";

  /**
   * SPA 首页.
   */
  public static final String SPA_INDEX_PAGE = "classpath:/static/index.html";

  /**
   * 配置 Web 服务器工厂:
   *
   * <ul>
   *   <li>将 "404 未找" 到重定向至自定义 Controller {@value #URI_NOT_FOUND}</li>
   * </ul>
   *
   * @return 自定义配置后的 Web 服务器工厂
   */
  @Bean
  public WebServerFactoryCustomizer<ConfigurableServletWebServerFactory> webServerFactoryCustomizer() {
    return factory -> factory.addErrorPages(new ErrorPage(HttpStatus.NOT_FOUND, URI_NOT_FOUND));
  }

  private final ResourceLoader resourceLoader;

  /**
   * 404 处理, 按规则返回 JSON 数据或页面.
   *
   * <p>返回 JSON 数据:
   *
   * <ol>
   *   <li>请求头 {@value HttpHeaders#ACCEPT} 中存在 {@value MediaType#APPLICATION_JSON_VALUE}</li>
   *   <li>请求 URI 以 {@value #URI_PREFIX_API} 开头</li>
   * </ol>
   *
   * <p>其他情况一律返回页面, 因为前端 SPA 单页面应用已作为静态资源打包在了 Jar 中.
   *
   * <p>Spring Boot 默认会将 {@code src/main/resources/static/} 中的内容作为 Web 静态资源提供.
   *
   * <p>约定 SPA 的页面入口：{@value #SPA_INDEX_PAGE}.
   *
   * <h2>扩展说明</h2>
   *
   * <p>Spring Boot Web 静态资源查找目录，由优先级高到低排序:
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
  @RequestMapping(URI_NOT_FOUND)
  public ResponseEntity<?> handleNotFoundRequest(HttpServletRequest req) {
    // 若 API 或 JSON 数据请求, 则返回 JSON 数据
    String oriUri = Optional.ofNullable(req.getAttribute(RequestDispatcher.FORWARD_SERVLET_PATH))
        .map(Object::toString)
        .orElse("");

    if (isJsonRequest(req, oriUri)) {
      return ResponseEntity
          .status(HttpStatus.NOT_FOUND)
          .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
          .body(new ApiError(HttpStatus.NOT_FOUND, "未找到请求的资源", oriUri));
    }

    // 返回 SPA 首页, 由前端处理 404
    String spaIndexHtml = getSpaIndexHtml();
    if (spaIndexHtml == null) {
      log.warn("未找到 SPA 首页文件 [{}]", SPA_INDEX_PAGE);
      return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    return ResponseEntity
        .status(HttpStatus.OK)
        .header(HttpHeaders.CONTENT_TYPE, MediaType.TEXT_HTML_VALUE)
        .body(spaIndexHtml);
  }

  private String getSpaIndexHtml() {
    Resource resource = resourceLoader.getResource(SPA_INDEX_PAGE);
    if (!resource.exists()) {
      return null;
    }

    try (InputStreamReader reader = new InputStreamReader(resource.getInputStream(),
        StandardCharsets.UTF_8)) {
      return FileCopyUtils.copyToString(reader);
    } catch (IOException e) {
      throw new RuntimeException(e);
    }
  }

  private boolean isJsonRequest(HttpServletRequest req, String oriUri) {
    String accept = Optional.ofNullable(req.getHeader(HttpHeaders.ACCEPT)).orElse("");

    if (accept.contains(MediaType.APPLICATION_JSON_VALUE)) {
      return true;
    }

    return oriUri.startsWith(URI_PREFIX_API);
  }
}
