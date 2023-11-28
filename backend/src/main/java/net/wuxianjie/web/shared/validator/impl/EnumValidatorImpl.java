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
 * 实现枚举值校验注解的处理逻辑。
 **/
@Slf4j
public class EnumValidatorImpl implements ConstraintValidator<EnumValidator, Object> {

    /**
     * 需要校验的枚举值所对应的方法名。
     */
    public static final String METHOD_NAME = "getCode";

    private boolean isPassed = false;

    private final List<Object> values = new ArrayList<>();

    @Override
    public void initialize(final EnumValidator enumValidator) {
        final Class<? extends Enum<?>> enumClass = enumValidator.value();

        if (!enumClass.isEnum()) {
            log.warn("忽略枚举值校验 [{} 不是枚举类]", enumClass.getName());

            isPassed = true;

            return;
        }

        final Enum<?>[] enumConstants = enumClass.getEnumConstants();

        for (final Enum<?> theEnum : enumConstants) {
            try {
                final Method method = theEnum.getClass().getDeclaredMethod(METHOD_NAME);

                method.setAccessible(true);

                values.add(method.invoke(theEnum));
            } catch (NoSuchMethodException e) {
                isPassed = true;

                log.warn(
                        "忽略枚举值校验 [{} 不存在 {} 方法]",
                        enumClass.getName(),
                        METHOD_NAME
                );
            } catch (InvocationTargetException | IllegalAccessException e) {
                isPassed = true;

                log.warn(
                        "忽略枚举值校验 [{}.{} 方法执行出错]",
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
