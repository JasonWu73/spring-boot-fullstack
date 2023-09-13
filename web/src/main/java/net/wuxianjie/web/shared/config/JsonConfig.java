package net.wuxianjie.web.shared.config;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.*;
import com.fasterxml.jackson.databind.json.JsonMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * JSON 序列化与反序列化配置。
 */
@Configuration
public class JsonConfig {

  public static final String DATE_TIME_PATTERN = "yyyy-MM-dd HH:mm:ss";

  /**
   * @return 支持将日期时间对象与可读字符串之间序列化与反序列化的 Jackson {@link ObjectMapper}
   */
  @Bean
  public ObjectMapper objectMapper() {
    // 配置 Java 8 `LocalDateTime` 与 `LocalDate` 的 JSON 序列化与反序列化
    JavaTimeModule timeModule = configureDateTimeModule();

    return JsonMapper.builder()
      .addModule(timeModule)
      // 仅对 `java.util.Date` 有效
      .configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false)
      .build()
      // 仅对 `java.util.Date` 有效
      .setDateFormat(new SimpleDateFormat(DATE_TIME_PATTERN));
  }

  private JavaTimeModule configureDateTimeModule() {
    JavaTimeModule timeModule = new JavaTimeModule();

    timeModule.addSerializer(LocalDateTime.class, new JsonSerializer<>() {
      @Override
      public void serialize(LocalDateTime value, JsonGenerator gen, SerializerProvider serializers) throws IOException {
        gen.writeString(value.format(DateTimeFormatter.ofPattern(DATE_TIME_PATTERN)));
      }
    });

    timeModule.addDeserializer(LocalDateTime.class, new JsonDeserializer<>() {
      @Override
      public LocalDateTime deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
        return LocalDateTime.parse(p.getValueAsString(), DateTimeFormatter.ofPattern(DATE_TIME_PATTERN));
      }
    });

    return timeModule;
  }
}
