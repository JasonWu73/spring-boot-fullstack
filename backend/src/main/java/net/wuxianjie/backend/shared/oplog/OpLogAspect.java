package net.wuxianjie.backend.shared.oplog;

import jakarta.servlet.http.HttpServletRequest;
import java.lang.reflect.Method;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import net.wuxianjie.backend.shared.auth.AuthUtils;
import net.wuxianjie.backend.shared.auth.dto.CachedAuth;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.stereotype.Component;

/**
 * 用于记录操作日志的切面。
 * <p>
 * <h2>连接点（JoinPoint）和切点（Pointcut）的区别</h2>
 *
 * <ul>
 *   <li>作用范围：连接点代表程序中的某一个具体的点，比如一个具体的方法调用；而切点代表一组连接点，定义了通知（Advice）应该应用的目标范围</li>
 *   <li>使用场景：在编写通知时，使用连接点参数来获取当前上下文信息；而使用切点定义通知应用的位置</li>
 * </ul>
 */
@Aspect
@Component
@RequiredArgsConstructor
public class OpLogAspect {

  private static final String LOCALHOST = "localhost";
  private static final String LOCALHOST_ADDR = "0:0:0:0:0:0:0:1";

  private final HttpServletRequest req;

  private final OpLogMapper opLogMapper;

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
   * @param joinPoint 连接点
   * @return 实际方法的执行结果
   * @throws Throwable 如果实际方法抛出了异常，则继续抛出
   */
  @Around("@annotation(net.wuxianjie.backend.shared.oplog.Operation)")
  public Object recordOperationLog(final ProceedingJoinPoint joinPoint)
    throws Throwable {
    // 记录本次请求的时间
    final LocalDateTime requestedAt = LocalDateTime.now();

    // 执行实际方法
    final Object result = joinPoint.proceed();

    // ----- 记录操作日志 -----
    final OpLog operation = new OpLog();

    operation.setRequestedAt(requestedAt);

    operation.setClientIp(getClientIp(req));

    operation.setUsername(
      AuthUtils.getCurrentUser().map(CachedAuth::username).orElse(null)
    );

    operation.setMessage(getOperation(joinPoint));

    opLogMapper.insert(operation);

    return result;
  }

  private String getClientIp(final HttpServletRequest req) {
    final String remoteAddr = req.getRemoteAddr();

    return LOCALHOST_ADDR.equals(remoteAddr) ? LOCALHOST : remoteAddr;
  }

  private String getOperation(final ProceedingJoinPoint joinPoint) {
    final Method method =
      ((MethodSignature) joinPoint.getSignature()).getMethod();

    final Operation annotation = method.getAnnotation(Operation.class);

    return annotation.value();
  }
}
