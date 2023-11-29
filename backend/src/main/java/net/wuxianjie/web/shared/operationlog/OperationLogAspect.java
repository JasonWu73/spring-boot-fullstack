package net.wuxianjie.web.shared.operationlog;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import net.wuxianjie.web.shared.auth.AuthUtils;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.stereotype.Component;

import java.lang.reflect.Method;
import java.time.LocalDateTime;

/**
 * 用于记录操作日志的切面。
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
   * 记录操作日志。
   *
   * @param joinPoint 切点
   * @return 实际方法的执行结果
   * @throws Throwable 如果实际方法抛出异常，则继续抛出
   */
  @Around("@annotation(Operation)")
  public Object recordOperationLog(final ProceedingJoinPoint joinPoint) throws Throwable {
    // 记录当前请求时间
    final LocalDateTime requestedAt = LocalDateTime.now();

    // 执行实际方法，并返回最终结果
    final Object result = joinPoint.proceed();

    // 构造需要保存的操作日志
    final OperationLog operation = new OperationLog();

    // 设置请求时间
    operation.setRequestedAt(requestedAt);

    // 设置客户端 IP
    final String remoteAddr = request.getRemoteAddr();
    operation.setClientIp(LOCALHOST_ADDRESS.equals(remoteAddr) ? LOCALHOST : remoteAddr);

    // 设置用户名
    AuthUtils.getCurrentUser().ifPresent(auth -> operation.setUsername(auth.username()));

    // 设置操作描述
    final Method method = ((MethodSignature) joinPoint.getSignature()).getMethod();
    final Operation annotation = method.getAnnotation(Operation.class);
    operation.setMessage(annotation.value());

    // 保存操作日志至数据库
    operationLogMapper.insert(operation);

    // 返回实际方法的执行结果
    return result;
  }
}
