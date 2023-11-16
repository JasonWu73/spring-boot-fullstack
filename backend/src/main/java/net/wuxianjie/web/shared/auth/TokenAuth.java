package net.wuxianjie.web.shared.auth;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.StringUtils;

import java.util.List;

public interface TokenAuth {

  CachedAuth authenticate(String accessToken);

  /**
   * 将登录信息写入 Spring Security Context，以便后续其他代码可从 Spring Context 中获取登录信息。
   */
  default void setAuthenticatedContext(
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
