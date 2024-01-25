package net.wuxianjie.backend.shared.oplog;

import jakarta.servlet.http.HttpServletRequest;
import java.lang.reflect.Method;
import java.time.LocalDateTime;
import java.util.Objects;
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
 */
@Aspect
@Component
@RequiredArgsConstructor
public class OpLogAspect {

  private static final String LOCALHOST = "127.0.0.1";
  private static final String LOCALHOST_ADDRESS = "0:0:0:0:0:0:0:1";

  private final HttpServletRequest request;

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
   * @return 目标方法的执行结果
   * @throws Throwable 继续抛出在执行目标方法时产生的异常
   */
  @Around("@annotation(net.wuxianjie.backend.shared.oplog.Operation)")
  public Object recordOperationLog(final ProceedingJoinPoint joinPoint) throws Throwable {
    // 记录本次请求的时间
    final LocalDateTime requestedAt = LocalDateTime.now();

    // 执行目标方法
    final Object result = joinPoint.proceed();

    // ----- 记录操作日志 -----
    final OpLog operation = new OpLog();
    operation.setRequestedAt(requestedAt);
    operation.setClientIp(getClientIp(request));
    operation.setUsername(AuthUtils.getCurrentUser().map(CachedAuth::username).orElse(null));
    operation.setMessage(getOperation(joinPoint));
    opLogMapper.insert(operation);

    return result;
  }

  private String getClientIp(final HttpServletRequest request) {
    final String remoteAddr = request.getRemoteAddr();
    return Objects.equals(remoteAddr, LOCALHOST_ADDRESS) ? LOCALHOST : remoteAddr;
  }

  private String getOperation(final ProceedingJoinPoint joinPoint) {
    final Method method = ((MethodSignature) joinPoint.getSignature()).getMethod();
    final Operation annotation = method.getAnnotation(Operation.class);
    return annotation.value();
  }
}
