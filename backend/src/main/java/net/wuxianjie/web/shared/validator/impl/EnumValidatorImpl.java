package net.wuxianjie.web.shared.validator.impl;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import lombok.extern.slf4j.Slf4j;
import net.wuxianjie.web.shared.validator.EnumValidator;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.List;

/**
 * 实现 {@link EnumValidator} 注解的验证逻辑。
 **/
@Slf4j
public class EnumValidatorImpl implements ConstraintValidator<EnumValidator, Object> {

  /**
   * 枚举类中返回所对应验证值的方法名。
   */
  public static final String METHOD_NAME = "getCode";

  private boolean isPassed;
  private List<Object> values;

  @Override
  public void initialize(final EnumValidator enumValidator) {
    isPassed = false;
    values = new ArrayList<>();
    final Class<? extends Enum<?>> enumClass = enumValidator.value();

    if (!enumClass.isEnum()) {
      isPassed = true;
      log.warn("忽略枚举值验证 [{} 不是枚举类]", enumClass.getName());
      return;
    }

    final Enum<?>[] enums = enumClass.getEnumConstants();

    for (final Enum<?> theEnum : enums) {
      try {
        final Method method = theEnum.getClass().getDeclaredMethod(METHOD_NAME);
        method.setAccessible(true);
        values.add(method.invoke(theEnum));
      } catch (NoSuchMethodException e) {
        isPassed = true;
        log.warn(
          "忽略枚举值验证 [{} 不存在 {} 方法]",
          enumClass.getName(),
          METHOD_NAME
        );
      } catch (InvocationTargetException | IllegalAccessException e) {
        isPassed = true;
        log.warn(
          "忽略枚举值验证 [{}.{} 方法执行出错]",
          enumClass.getName(),
          METHOD_NAME
        );
      }
    }
  }

  @Override
  public boolean isValid(final Object value, final ConstraintValidatorContext context) {
    return isPassed || value == null || values.contains(value);
  }
}
