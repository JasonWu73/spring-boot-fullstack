package net.wuxianjie.backend.shared.validator.impl;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import net.wuxianjie.backend.shared.validator.EnumValidator;

/**
 * 实现 {@link EnumValidator} 注解的验证逻辑。
 **/
@Slf4j
public class EnumValidatorImpl implements ConstraintValidator<EnumValidator, Object> {

  /**
   * 枚举类中返回所对应验证值的方法名。
   */
  public static final String METHOD_NAME = "getCode";

  private boolean passed;
  private List<Object> values;

  @Override
  public void initialize(final EnumValidator enumValidator) {
    passed = false;
    values = new ArrayList<>();

    final Class<? extends Enum<?>> enumClass = enumValidator.value();
    final Enum<?>[] enums = enumClass.getEnumConstants();
    for (final Enum<?> theEnum : enums) {
      try {
        final Method method = theEnum.getClass().getDeclaredMethod(METHOD_NAME);
        method.setAccessible(true);
        values.add(method.invoke(theEnum));
      } catch (NoSuchMethodException e) {
        passed = true;
        log.warn("忽略枚举值验证 [{} 不存在 {} 方法]", enumClass.getName(), METHOD_NAME);
      } catch (InvocationTargetException | IllegalAccessException e) {
        passed = true;
        log.warn("忽略枚举值验证 [{}.{} 方法执行出错]", enumClass.getName(), METHOD_NAME);
      }
    }
  }

  @Override
  public boolean isValid(final Object value, final ConstraintValidatorContext context) {
    return passed || value == null || values.contains(value);
  }
}
