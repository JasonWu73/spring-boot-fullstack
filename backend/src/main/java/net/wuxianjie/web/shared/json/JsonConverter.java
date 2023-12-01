package net.wuxianjie.web.shared.json;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

/**
 * JSON 转换器。
 */
@Component
@RequiredArgsConstructor
public class JsonConverter {

  private final ObjectMapper objectMapper;

  /**
   * 将对象转换为 JSON 字符串。
   *
   * @param obj 需要转换的对象
   * @return JSON 字符串
   */
  public String toJson(final Object obj) {
    try {
      return objectMapper.writeValueAsString(obj);
    } catch (final Exception e) {
      throw new RuntimeException(e);
    }
  }

  /**
   * 将 JSON 字符串转换为对象。
   *
   * @param json 需要转换的 JSON 字符串
   * @param valueType 目标对象的类类型
   * @param <T> 目标对象的泛型类型参数
   * @return 指定类型的对象
   */
  public <T> T parseJson(final String json, final Class<T> valueType) {
    try {
      return objectMapper.readValue(json, valueType);
    } catch (final Exception e) {
      throw new RuntimeException(e);
    }
  }

  /**
   * 将 JSON 字符串转换为指定泛型的对象。
   *
   * @param json 需要转换的 JSON 字符串
   * @param valueTypeRef 目标对象的泛型引用
   * @param <T> 目标对象的泛型类型参数
   * @return 指定泛型的对象
   */
  public <T> T parseJson(final String json, final TypeReference<T> valueTypeRef) {
    try {
      return objectMapper.readValue(json, valueTypeRef);
    } catch (final Exception e) {
      throw new RuntimeException(e);
    }
  }
}
