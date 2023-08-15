package net.wuxianjie.springbootdemo.shared.config;

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

@Configuration
public class JsonConfig {

  @Bean
  public ObjectMapper objectMapper() {
    // 配置 Jackson 对日期对象序列化/反序列化配置的 JSON 映射器实例
    String dateTimePattern = "yyyy-MM-dd HH:mm:ss";

    // 自定义一个 `LocalDateTime` 序列化/反序列化器
    JavaTimeModule timeModule = new JavaTimeModule();
    timeModule.addSerializer(LocalDateTime.class, new JsonSerializer<>() {
      @Override
      public void serialize(LocalDateTime value, JsonGenerator gen, SerializerProvider serializers) throws IOException {
        gen.writeString(value.format(DateTimeFormatter.ofPattern(dateTimePattern)));
      }
    });

    timeModule.addDeserializer(LocalDateTime.class, new JsonDeserializer<>() {
      @Override
      public LocalDateTime deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
        return LocalDateTime.parse(p.getValueAsString(), DateTimeFormatter.ofPattern(dateTimePattern));
      }
    });

    // 将 `LocalDateTime` 的序列化/反序列化配置加入其中
    // 默认 `yyyy-MM-dd HH:mm:ss` 仅对 `Date` 和 `LocalDate` 生效
    JsonMapper mapper = JsonMapper.builder()
      .addModule(timeModule)
      .configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false) // 禁用将日期写为时间戳的特性
      .build();

    mapper.setDateFormat(new SimpleDateFormat(dateTimePattern));

    return mapper;
  }
}
