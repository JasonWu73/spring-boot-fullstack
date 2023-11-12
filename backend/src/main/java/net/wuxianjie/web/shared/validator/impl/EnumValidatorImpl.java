package net.wuxianjie.web.shared.validator.impl;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import lombok.extern.slf4j.Slf4j;
import net.wuxianjie.web.shared.validator.EnumValidator;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

/**
 * 实现枚举值校验注解的处理逻辑。
 **/
@Slf4j
public class EnumValidatorImpl implements ConstraintValidator<EnumValidator, Object> {

  public static final String METHOD_NAME = "getCode";

  private boolean isPassed = false;
  private List<Object> values;

  @Override
  public void initialize(final EnumValidator enumValidator) {
    values = new ArrayList<>();
    final Class<? extends Enum<?>> enumClass = enumValidator.value();
    Optional.ofNullable(enumClass.getEnumConstants())
      .ifPresent(enums -> Arrays.stream(enums)
        .forEach(theEnum -> {
          try {
            final Method method = theEnum.getClass().getDeclaredMethod(METHOD_NAME);
            method.setAccessible(true);
            values.add(method.invoke(theEnum));
          } catch (NoSuchMethodException e) {
            isPassed = true;
            log.warn("忽略枚举值校验 [{} 不存在 {} 方法]", enumClass.getName(), METHOD_NAME);
          } catch (InvocationTargetException | IllegalAccessException e) {
            isPassed = true;
            log.warn("忽略枚举值校验 [{}.{} 方法执行出错]", enumClass.getName(), METHOD_NAME);
          }
        })
      );
  }

  @Override
  public boolean isValid(final Object value, final ConstraintValidatorContext context) {
    return isPassed || value == null || values.contains(value);
  }
}
