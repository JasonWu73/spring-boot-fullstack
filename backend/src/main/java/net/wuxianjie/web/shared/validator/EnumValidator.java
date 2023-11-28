package net.wuxianjie.web.shared.validator;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import net.wuxianjie.web.shared.validator.impl.EnumValidatorImpl;

import java.lang.annotation.Repeatable;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import static java.lang.annotation.ElementType.*;

/**
 * 枚举值校验注解（需要枚举值对应的方法名为 {@value EnumValidatorImpl#METHOD_NAME}）。
 *
 * <p>注意：{@code null} 值被认为是合法的。
 **/
@Target({METHOD, FIELD, ANNOTATION_TYPE, CONSTRUCTOR, PARAMETER, TYPE_USE})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = EnumValidatorImpl.class)
@Repeatable(EnumValidator.List.class)
public @interface EnumValidator {

    Class<? extends Enum<?>> value();

    String message() default "类型不合法";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};

    @Target({METHOD, FIELD, ANNOTATION_TYPE, CONSTRUCTOR, PARAMETER, TYPE_USE})
    @Retention(RetentionPolicy.RUNTIME)
    @interface List {

        EnumValidator[] value();
    }
}
