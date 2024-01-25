package net.wuxianjie.backend.shared.oplog;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * 操作日志注解。
 * <p>
 * 将此注解应用到方法上，即可记录当前登录用户以什么 IP 在什么时间做了什么操作。
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface Operation {

  /**
   * 操作描述。
   *
   * @return 操作描述
   */
  String value() default "操作描述";
}
