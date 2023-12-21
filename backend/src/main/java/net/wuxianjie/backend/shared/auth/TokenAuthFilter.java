package net.wuxianjie.backend.shared.auth;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import net.wuxianjie.backend.shared.auth.dto.CachedAuth;
import net.wuxianjie.backend.shared.exception.ApiException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.HandlerExceptionResolver;

import java.io.IOException;

/**
 * 访问令牌（Access Token）身份验证过滤器。
 */
@RequiredArgsConstructor
public class TokenAuthFilter extends OncePerRequestFilter {

  /**
   * 携带访问令牌（Access Token）的请求头值前缀：
   *
   * <pre>{@code "Authorization: Bearer {{accessToken}}" }</pre>
   */
  private static final String BEARER_PREFIX = "Bearer ";

  private final HandlerExceptionResolver handlerExceptionResolver;

  private final TokenAuth tokenAuth;

  /**
   * 执行身份验证。
   *
   * <ul>
   *   <li>从 HTTP 请求头中获取访问令牌：{@code "Authorization: Bearer {{accessToken}}" }</li>
   *   <li>对 {@code accessToken} 执行身份验证</li>
   *   <li>在身份验证通过后，会将登录信息写入 Spring Security Context</li>
   * </ul>
   *
   * @param request HTTP 请求对象
   * @param response HTTP 响应对象
   * @param filterChain 过滤器链
   * @throws ServletException Servlet 执行错误时抛出
   * @throws IOException IO 操作错误时抛出
   */
  @Override
  protected void doFilterInternal(
    @NonNull final HttpServletRequest request,
    @NonNull final HttpServletResponse response,
    @NonNull final FilterChain filterChain
  ) throws ServletException, IOException {
    // 从 HTTP 请求头中获取访问令牌
    final String authorization = request.getHeader(HttpHeaders.AUTHORIZATION);

    if (authorization == null) {
      filterChain.doFilter(request, response);
      return;
    }

    if (!authorization.startsWith(BEARER_PREFIX)) {
      handlerExceptionResolver.resolveException(
        request,
        response,
        null,
        new ApiException(
          HttpStatus.UNAUTHORIZED,
          "HTTP 请求头 [%s: %s] 格式错误".formatted(
            HttpHeaders.AUTHORIZATION,
            authorization
          )
        )
      );

      return;
    }

    final String accessToken = authorization.substring(BEARER_PREFIX.length());

    // 执行身份验证
    final CachedAuth auth;

    try {
      auth = tokenAuth.authenticate(accessToken);
    } catch (Exception e) {
      handlerExceptionResolver.resolveException(
        request,
        response,
        null,
        new ApiException(HttpStatus.UNAUTHORIZED, "登录过期", e)
      );

      return;
    }

    // 将登录信息写入 Spring Security Context
    AuthUtils.setAuthenticatedContext(auth, request);

    // 继续执行过滤器链
    filterChain.doFilter(request, response);
  }
}
