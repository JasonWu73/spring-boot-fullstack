package net.wuxianjie.web.shared.pagination;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.Optional;

/**
 * 自动设置分页查询参数偏移量 OFFSET 的切面。
 **/
@Aspect
@Component
public class PaginationOffsetAspect {

  /**
   * Controller 分页查询方法的切入点：
   *
   * <ol>
   *   <li>类名后缀为 {@code Controller}</li>
   *   <li>方法的访问修饰符为 {@code public}</li>
   *   <li>方法存在 {@link PaginationParam} 参数</li>
   * </ol>
   *
   * <p>切入点表达式：
   *
   * <pre>{@code
   * execution([方法的可见性] 返回类型 [方法所在类的全路径名].方法名(参数类型列表) [方法抛出的异常类型])
   * }</pre>
   */
  @Pointcut(
      "execution(public * *..*Controller.*(.., net.wuxianjie.web.shared.pagination.PaginationParam, ..))"
  )
  private void getPagedQueryResults() {}

  /**
   * 为分页查询方法设置分页查询参数的偏移量 OFFSET。
   */
  @Before("getPagedQueryResults()")
  public void setPaginationOffsetParam(final JoinPoint joinPoint) {
    Optional
        .ofNullable(joinPoint.getArgs())
        .flatMap(args -> Arrays.stream(args)
            .filter(arg -> (arg instanceof PaginationParam))
            .findFirst()
            .map(arg -> (PaginationParam) arg)
        )
        .ifPresent(PaginationParam::setOffset);
  }
}
