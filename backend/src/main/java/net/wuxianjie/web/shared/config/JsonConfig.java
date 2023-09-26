package net.wuxianjie.web.shared.config;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.json.JsonMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class JsonConfig {

  public static final String DATE_TIME_PATTERN = "yyyy-MM-dd HH:mm:ss";

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
      public void serialize(LocalDateTime value, JsonGenerator gen, SerializerProvider serializers)
          throws IOException {
        gen.writeString(value.format(DateTimeFormatter.ofPattern(DATE_TIME_PATTERN)));
      }
    });

    timeModule.addDeserializer(LocalDateTime.class, new JsonDeserializer<>() {
      @Override
      public LocalDateTime deserialize(JsonParser p, DeserializationContext ctxt)
          throws IOException {
        return LocalDateTime.parse(p.getValueAsString(),
            DateTimeFormatter.ofPattern(DATE_TIME_PATTERN));
      }
    });

    return timeModule;
  }
}
