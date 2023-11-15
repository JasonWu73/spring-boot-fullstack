package net.wuxianjie.web.auth;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import net.wuxianjie.web.shared.exception.ApiException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.HandlerExceptionResolver;

import java.io.IOException;
import java.util.ArrayList;

@RequiredArgsConstructor
public class TokenAuthFilter extends OncePerRequestFilter {

  /**
   * 携带访问令牌（Access Token）的请求头值前缀：
   *
   * <pre>{@code
   *   "Authorization: Bearer {{accessToken}}"
   * }</pre>
   */
  public static final String BEARER_PREFIX = "Bearer ";

  private final HandlerExceptionResolver handlerExceptionResolver;
  private final TokenAuth tokenAuth;

  @Override
  protected void doFilterInternal(
    final HttpServletRequest request,
    final HttpServletResponse response,
    final FilterChain filterChain
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
          "HTTP 请求头 [%s: %s] 格式错误".formatted(HttpHeaders.AUTHORIZATION, authorization)
        )
      );
      return;
    }

    final String accessToken = authorization.substring(BEARER_PREFIX.length());

    // 执行身份验证
    final AuthData authData = tokenAuth.authenticate(accessToken);

    // 将登录信息写入 Spring Security Context
    final UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(
      authData,
      null,
      authData == null
        ? new ArrayList<>()
        : AuthorityUtils.createAuthorityList(authData.getAuthorities())
    );

    token.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

    SecurityContextHolder.getContext().setAuthentication(token);

    // 继续执行过滤器链
    filterChain.doFilter(request, response);
  }
}
