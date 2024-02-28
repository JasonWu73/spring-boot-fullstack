package net.wuxianjie.backend.shared.util;

import lombok.NonNull;
import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.stereotype.Component;

/**
 * 通过此类可在 POJO 中获取 Spring 管理的 Bean 实例。
 */
@Component
public class SpringContext implements ApplicationContextAware {

  private static ApplicationContext context;

  /**
   * 获取 Spring 管理的 Bean 实例。
   *
   * @param beanClass IoC 容器中的 Bean 类型
   * @return Spring IoC 容器中的 Bean 实例，如果不存在则返回 `null`
   * @param <T> Bean 类型
   */
  public static <T> T getBean(final Class<T> beanClass) {
    return context.getBean(beanClass);
  }

  @Override
  public void setApplicationContext(@NonNull final ApplicationContext applicationContext)
    throws BeansException {
    // 保存 ApplicationContext 引用，以便后续用于获取 Spring 管理的 Bean 实例
    SpringContext.context = applicationContext;
  }
}
