package net.wuxianjie.web.shared.auth;

import lombok.RequiredArgsConstructor;
import net.wuxianjie.web.shared.exception.ApiException;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.expression.method.DefaultMethodSecurityExpressionHandler;
import org.springframework.security.access.hierarchicalroles.RoleHierarchy;
import org.springframework.security.access.hierarchicalroles.RoleHierarchyImpl;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.HandlerExceptionResolver;

import java.util.List;

/**
 * Spring Security 配置。
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

  /**
   * API 请求路径前缀。
   */
  public static final String API_PATH_PREFIX = "/api/";

  private static final String AUTH_HIERARCHY = """
    root > admin
    admin > user""";

  private final HandlerExceptionResolver handlerExceptionResolver;

  private final TokenAuth tokenAuth;

  /**
   * 配置 Spring Security 过滤器链。
   * <p>
   * <h2>对所有请求都生效的通用配置</h2>
   *
   * <ul>
   *   <li>默认所有请求所有人都可访问（保证 SPA 前端资源可用）</li>
   *   <li>支持 CORS</li>
   *   <li>禁用 CSRF</li>
   *   <li>允许浏览器在同源策略下使用 {@code <frame>} 或 {@code <iframe>}</li>
   *   <li>无状态会话，即不向客户端发送 {@code JSESSIONID} Cookie</li>
   *   <li>认证（Authentication）401 和授权（Authorization）403 异常处理</li>
   * </ul>
   *
   * <h2>仅对特定请求（即以 {@value API_PATH_PREFIX} 为前缀的请求路径）生效的特殊配置</h2>
   *
   * <ul>
   *   <li>开放登录 API</li>
   *   <li>开放公开的 API</li>
   *   <li>默认所有 API 都需要登录才能访问</li>
   *   <li>自定义 Token 身份验证过滤器</li>
   * </ul>
   *
   * @param http Spring Security HTTP 配置对象
   * @return Spring Security 过滤器链
   * @throws Exception 配置错误时抛出
   */
  @Bean
  public SecurityFilterChain filterChain(final HttpSecurity http) throws Exception {
    // 以下配置仅对 API 请求（即以 `/api/` 为前缀的 Path）生效
    http
      .securityMatcher("/api/**")
      // 按顺序比较，符合则退出后续比较
      .authorizeHttpRequests(auth -> {
        // 开放登录 API
        auth.requestMatchers("/api/v1/auth/login").permitAll()
          // 开放公开的 API
          .requestMatchers("/api/v1/public/**").permitAll()
          // 默认所有 API 都需要登录才能访问
          .requestMatchers("/**").authenticated();
      })
      // 添加自定义 Token 身份验证过滤器
      .addFilterBefore(
        new TokenAuthFilter(handlerExceptionResolver, tokenAuth),
        UsernamePasswordAuthenticationFilter.class
      );

    // 以下配置对所有请求生效
    http
      // 按顺序比较，符合则退出后续比较
      .authorizeHttpRequests(auth -> {
        // 默认所有请求所有人都可访问（保证 SPA 前端资源可用）
        auth.requestMatchers("/**").permitAll();
      })
      // 支持 CORS
      .cors(Customizer.withDefaults())
      // 禁用 CSRF
      .csrf(AbstractHttpConfigurer::disable)
      // 允许浏览器在同源策略下使用 `<frame>` 或 `<iframe>`
      .headers(headers ->
        headers.frameOptions(HeadersConfigurer.FrameOptionsConfig::sameOrigin)
      )
      // 无状态会话，即不向客户端发送 `JSESSIONID` Cookies
      .sessionManagement(session ->
        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
      )
      // 身份验证和权限异常处理
      .exceptionHandling(exceptionHandling -> {
        // 未通过身份验证，对应 401 HTTP 状态码
        exceptionHandling.authenticationEntryPoint((request, response, e) ->
          handlerExceptionResolver.resolveException(
            request,
            response,
            null,
            new ApiException(HttpStatus.UNAUTHORIZED, "身份验证失败", e)
          )
        );

        // 通过身份验证，但权限不足，对应 403 HTTP 状态码
        exceptionHandling.accessDeniedHandler((request, response, e) ->
          handlerExceptionResolver.resolveException(
            request,
            response,
            null,
            new ApiException(HttpStatus.FORBIDDEN, "权限鉴权失败", e)
          )
        );
      });

    return http.build();
  }

  /**
   * 配置 Spring Security 中集成的 CORS。
   *
   * @return CORS 配置
   */
  @Bean
  CorsConfigurationSource corsConfigurationSource() {
    final CorsConfiguration configuration = new CorsConfiguration();

    // 以下配置缺一不可
    configuration.setAllowedOriginPatterns(List.of("*"));
    configuration.setAllowedMethods(List.of("*"));
    configuration.setAllowCredentials(true);
    configuration.setAllowedHeaders(List.of("*"));

    final UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);

    return source;
  }

  /**
   * 密码哈希算法。
   *
   * @return 密码哈希算法
   */
  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  /**
   * 配置拥有上下级关系的功能权限。
   * <p>
   * Spring Boot 3 即 Spring Security 6 开始，还需要创建 {@link #expressionHandler()}。
   *
   * @return 拥有上下级关系的功能权限
   */
  @Bean
  public RoleHierarchy roleHierarchy() {
    final RoleHierarchyImpl roleHierarchy = new RoleHierarchyImpl();
    roleHierarchy.setHierarchy(AUTH_HIERARCHY);
    return roleHierarchy;
  }

  /**
   * Spring Boot 3 即 Spring Security 6 开始，配置 {@link #roleHierarchy()} 的必要 Bean。
   *
   * @return {@link #roleHierarchy()} 的必要 Bean
   */
  @Bean
  public DefaultMethodSecurityExpressionHandler expressionHandler() {
    final DefaultMethodSecurityExpressionHandler handler = new DefaultMethodSecurityExpressionHandler();
    handler.setRoleHierarchy(roleHierarchy());
    return handler;
  }
}
