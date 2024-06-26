package net.wuxianjie.backend.shared.auth;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Optional;
import net.wuxianjie.backend.shared.auth.dto.AuthenticatedUser;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.StringUtils;

/**
 * 身份验证工具类。
 */
public class AuthUtils {

  /**
   * 从 Spring Security Context 中获取当前登录用户信息。
   *
   * @return 当前登录用户信息
   */
  public static Optional<AuthenticatedUser> getCurrentUser() {
    final Authentication user = SecurityContextHolder.getContext().getAuthentication();
    if (user == null || user instanceof AnonymousAuthenticationToken) {
      return Optional.empty();
    }

    return Optional.of((AuthenticatedUser) user.getPrincipal());
  }

  /**
   * 将登录信息写入 Spring Security Context。
   *
   * @param user 已通过身份验证的用户信息
   * @param request HTTP 请求对象
   */
  public static void setAuthenticatedContext(
    final AuthenticatedUser user,
    final HttpServletRequest request
  ) {
    final List<String> rawAuthorities = user.authorities();
    final List<SimpleGrantedAuthority> authorities = rawAuthorities
      .stream()
      .filter(StringUtils::hasText)
      .map(SimpleGrantedAuthority::new)
      .toList();

    final UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(
      user,
      null,
      authorities
    );
    token.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
    SecurityContextHolder.getContext().setAuthentication(token);
  }
}
