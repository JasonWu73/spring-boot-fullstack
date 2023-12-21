package net.wuxianjie.backend.shared.json;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.*;
import com.fasterxml.jackson.databind.json.JsonMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * JSON 解析配置。
 */
@Configuration
public class JsonConfig {

  /**
   * 系统中使用的日期时间格式。
   */
  public static final String DATE_TIME_PATTERN = "yyyy-MM-dd HH:mm:ss";

  /**
   * 配置使用自定义 {@link #objectMapper()} 的 {@link MappingJackson2HttpMessageConverter} 实例。
   * <p>
   * 用于配置 {@link org.springframework.web.client.RestClient}。
   *
   * @return 自定义的 {@link MappingJackson2HttpMessageConverter} 实例
   */
  @Bean
  public MappingJackson2HttpMessageConverter mappingJackson2HttpMessageConverter() {
    final MappingJackson2HttpMessageConverter converter =
      new MappingJackson2HttpMessageConverter();

    converter.setObjectMapper(objectMapper());

    return converter;
  }

  /**
   * 配置 Jackson 的 {@code ObjectMapper}，即 Spring MVC 中默认使用的 JSON 解析工具。
   *
   * <ul>
   *   <li>配置日期时间的解析字符串格式，包含 {@link java.util.Date} 与 Java 8 引入的 {@link java.time.LocalDateTime} 和 {@link java.time.LocalDate}</li>
   *   <li>若空字符串转换为 POJO 时（非 {@code String} 类型），则会转换为 {@code null}</li>
   *   <li>忽略未知的 JSON 字段，即遇到未知字段时不抛出异常</li>
   * </ul>
   *
   * @return {@code ObjectMapper} 实例
   */
  @Bean
  public ObjectMapper objectMapper() {
    final JavaTimeModule timeModule = getJavaTimeModule();

    return JsonMapper
      .builder()
      .enable(DeserializationFeature.ACCEPT_EMPTY_STRING_AS_NULL_OBJECT)
      .disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
      .addModule(timeModule)
      .configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false)
      .build()
      .setDateFormat(new SimpleDateFormat(DATE_TIME_PATTERN));
  }

  private static JavaTimeModule getJavaTimeModule() {
    final JavaTimeModule timeModule = new JavaTimeModule();

    timeModule.addSerializer(LocalDateTime.class, new JsonSerializer<>() {

      @Override
      public void serialize(
        final LocalDateTime value,
        final JsonGenerator gen,
        final SerializerProvider serializers
      ) throws IOException {
        gen.writeString(
          value.format(DateTimeFormatter.ofPattern(DATE_TIME_PATTERN))
        );
      }
    });

    timeModule.addDeserializer(LocalDateTime.class, new JsonDeserializer<>() {

      @Override
      public LocalDateTime deserialize(
        final JsonParser p,
        final DeserializationContext ctx
      ) throws IOException {
        return LocalDateTime.parse(
          p.getValueAsString(),
          DateTimeFormatter.ofPattern(DATE_TIME_PATTERN)
        );
      }
    });

    return timeModule;
  }
}
