package net.wuxianjie.backend.shared.operationlog;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import net.wuxianjie.backend.shared.auth.AuthUtils;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.stereotype.Component;

import java.lang.reflect.Method;
import java.time.LocalDateTime;

/**
 * 用于记录操作日志的切面。
 * <p>
 * <h2>连接点（JoinPoint）和切点（Pointcut）的区别</h2>
 *
 * <ul>
 *   <li>作用范围：连接点代表程序中的某一个具体的点，比如一个具体的方法调用；而切点代表一组连接点，定义了通知（Advice）应该应用的目标范围</li>
 *   <li>使用场景：在编写通知时，通常使用连接点参数来获取当前上下文信息；而在定义通知应用的位置时，使用切点来指定</li>
 * </ul>
 */
@Aspect
@Component
@RequiredArgsConstructor
public class OperationLogAspect {

  private static final String LOCALHOST = "localhost";
  private static final String LOCALHOST_ADDRESS = "0:0:0:0:0:0:0:1";

  private final HttpServletRequest request;

  private final OperationLogMapper operationLogMapper;

  /**
   * 记录被 {@link Operation} 注解标记的方法的操作日志。
   *
   * <ul>
   *   <li>记录进入方法时的时间，即请求时间</li>
   *   <li>记录客户端 IP</li>
   *   <li>记录用户名</li>
   *   <li>记录操作描述</li>
   * </ul>
   *
   * @param joinPoint 切点
   * @return 实际方法的执行结果
   * @throws Throwable 如果实际方法抛出异常，则继续抛出
   */
  @Around("@annotation(Operation)")
  public Object recordOperationLog(final ProceedingJoinPoint joinPoint) throws Throwable {
    final LocalDateTime requestedAt = LocalDateTime.now();

    final Object result = joinPoint.proceed();

    final OperationLog operation = new OperationLog();
    operation.setRequestedAt(requestedAt);

    final String remoteAddr = request.getRemoteAddr();
    operation.setClientIp(LOCALHOST_ADDRESS.equals(remoteAddr) ? LOCALHOST : remoteAddr);

    AuthUtils.getCurrentUser().ifPresent(auth -> operation.setUsername(auth.username()));

    final Method method = ((MethodSignature) joinPoint.getSignature()).getMethod();
    final Operation annotation = method.getAnnotation(Operation.class);
    operation.setMessage(annotation.value());

    operationLogMapper.insert(operation);

    return result;
  }
}
