package net.wuxianjie.web.shared.auth;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Optional;

public class AuthUtils {

  /**
   * 从 Spring Security Context 中获取当前登录用户信息。
   */
  public static Optional<CachedAuth> getCurrentUser() {
    final Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    if (auth == null || auth instanceof AnonymousAuthenticationToken) {
      return Optional.empty();
    }

    return Optional.of((CachedAuth) auth.getPrincipal());
  }


  /**
   * 将登录信息写入 Spring Security Context，以便后续其他代码获取登录信息。
   */
  public static void setAuthenticatedContext(
    final CachedAuth auth,
    final HttpServletRequest request
  ) {
    final List<String> rawAuthorities = auth.authorities();

    final List<SimpleGrantedAuthority> authorities = rawAuthorities
      .stream()
      .filter(StringUtils::hasText)
      .map(SimpleGrantedAuthority::new)
      .toList();

    final UsernamePasswordAuthenticationToken token =
      new UsernamePasswordAuthenticationToken(auth, null, authorities);

    token.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

    SecurityContextHolder.getContext().setAuthentication(token);
  }
}
