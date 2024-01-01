package net.wuxianjie.backend.shared.auth.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import org.springframework.security.access.prepost.PreAuthorize;

/**
 * 超级管理员权限。
 * <p>
 * 用在方法上，表示该方法需要超级管理员权限才能访问。
 * <p>
 * 权限有上下级关系：{@code root} > {@code admin} > {@code user}
 */
@PreAuthorize("hasAuthority('root')")
@Target({ ElementType.METHOD, ElementType.TYPE })
@Retention(RetentionPolicy.RUNTIME)
public @interface Root {
}
