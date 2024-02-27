package com.hzqg.digitalcourtom.shared.util;

import lombok.NonNull;
import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.stereotype.Component;

/**
 * This class is used to get a spring bean from IOC container to be used for regular java pojo classes.
 */
@Component
public class SpringContext implements ApplicationContextAware {

  private static ApplicationContext context;

  /**
   * Returns the Spring managed bean instance of the given class type if it exists.
   * Returns null otherwise.
   *
   * @param beanClass the class type of the managed bean
   * @return the managed bean instance
   * @param <T> the type of the managed bean
   */
  public static <T> T getBean(final Class<T> beanClass) {
    return context.getBean(beanClass);
  }

  @Override
  public void setApplicationContext(@NonNull final ApplicationContext applicationContext)
    throws BeansException {
    // store ApplicationContext reference to access required beans later on
    SpringContext.context = applicationContext;
  }
}
