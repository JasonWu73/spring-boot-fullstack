package net.wuxianjie.backend.shared.pagination;

import java.util.Arrays;
import java.util.Optional;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.stereotype.Component;

/**
 * 自动设置分页查询参数偏移量 OFFSET 的切面。
 **/
@Aspect
@Component
public class PaginationOffsetAspect {

  /**
   * Controller 分页查询方法的切点：
   *
   * <ol>
   *   <li>类名后缀为 `Controller`</li>
   *   <li>方法的访问修饰符为 `public`</li>
   *   <li>方法存在 {@link PaginationParam} 参数</li>
   * </ol>
   *
   * <h3>切点表达式</h3>
   *
   * <pre>{@code
   * "execution([方法的可见性] 返回类型 [方法所在类的全路径名].方法名(参数类型列表) [方法抛出的异常类型])"
   * }</pre>
   */
  @Pointcut(
    "execution(public * *..*Controller.*(.., net.wuxianjie.backend.shared.pagination.PaginationParam, ..))"
  )
  private void getPagination() {}

  /**
   * 为分页查询方法设置分页查询参数的偏移量 OFFSET。
   *
   * @param joinPoint 连接点，通常指的是方法的调用
   */
  @Before("getPagination()")
  public void setPaginationOffsetParam(final JoinPoint joinPoint) {
    Optional
      .ofNullable(joinPoint.getArgs())
      .flatMap(args -> Arrays
        .stream(args)
        .filter(arg -> (arg instanceof PaginationParam))
        .findFirst()
        .map(arg -> (PaginationParam) arg))
      .ifPresent(PaginationParam::setOffset);
  }
}
