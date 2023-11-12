package net.wuxianjie.web.shared.config;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.*;
import com.fasterxml.jackson.databind.json.JsonMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import net.wuxianjie.web.shared.Constants;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Configuration
public class JsonConfig {

  @Bean
  public ObjectMapper objectMapper() {
    // 配置 Java 8 `LocalDateTime` 与 `LocalDate` 的 JSON 序列化与反序列化
    final JavaTimeModule timeModule = configureDateTimeModule();

    return JsonMapper.builder()
      // 对 Java 8 `LocalDateTime` 与 `LocalDate` 有效
      .addModule(timeModule)
      // 仅对 `java.util.Date` 有效
      .configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false)
      .build()
      // 仅对 `java.util.Date` 有效
      .setDateFormat(new SimpleDateFormat(Constants.DATE_TIME_PATTERN));
  }

  private JavaTimeModule configureDateTimeModule() {
    final JavaTimeModule module = new JavaTimeModule();

    module.addSerializer(LocalDateTime.class, new JsonSerializer<>() {
      @Override
      public void serialize(
        final LocalDateTime value,
        final JsonGenerator gen,
        final SerializerProvider serializers
      ) throws IOException {
        gen.writeString(value.format(DateTimeFormatter.ofPattern(Constants.DATE_TIME_PATTERN)));
      }
    });

    module.addDeserializer(LocalDateTime.class, new JsonDeserializer<>() {
      @Override
      public LocalDateTime deserialize(
        final JsonParser p,
        final DeserializationContext ctx
      ) throws IOException {
        return LocalDateTime.parse(p.getValueAsString(),
          DateTimeFormatter.ofPattern(Constants.DATE_TIME_PATTERN));
      }
    });

    return module;
  }
}
