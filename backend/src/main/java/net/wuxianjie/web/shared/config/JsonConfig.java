package net.wuxianjie.web.shared.config;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.*;
import com.fasterxml.jackson.databind.json.JsonMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import net.wuxianjie.web.shared.Constants;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.codec.json.Jackson2JsonDecoder;
import org.springframework.http.codec.json.Jackson2JsonEncoder;
import org.springframework.web.reactive.function.client.WebClient;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * 配置 JSON 序列化与反序列化。
 */
@Configuration
public class JsonConfig {

    /**
     * 配置 {@code WebClient} 使用指定的 {@code ObjectMapper}。
     */
    @Bean
    public WebClient webClient() {
        return WebClient.builder()
                .codecs(configurer -> {
                            configurer.defaultCodecs().jackson2JsonDecoder(
                                    new Jackson2JsonDecoder(objectMapper())
                            );
                            configurer.defaultCodecs().jackson2JsonEncoder(
                                    new Jackson2JsonEncoder(objectMapper())
                            );
                        }
                )
                .build();
    }

    /**
     * 配置 JSON 序列化与反序列化。
     */
    @Bean
    public ObjectMapper objectMapper() {
        // 配置 Java 8 `LocalDateTime` 与 `LocalDate` 的 JSON 序列化与反序列化
        final JavaTimeModule timeModule = getJavaTimeModule();

        return JsonMapper.builder()
                // 在反序列化时，若空字符串转换为 POJO 时（非 `String` 类型），则会转换为 `null`
                .enable(DeserializationFeature.ACCEPT_EMPTY_STRING_AS_NULL_OBJECT)
                // 在反序列化时，忽略未知的 JSON 字段
                .disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
                // 对 Java 8 `LocalDateTime` 与 `LocalDate` 有效
                .addModule(timeModule)
                // 仅对 `java.util.Date` 有效
                .configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false)
                .build()
                // 仅对 `java.util.Date` 有效
                .setDateFormat(new SimpleDateFormat(Constants.DATE_TIME_PATTERN));
    }

    /**
     * 配置 Java 8 `LocalDateTime` 与 `LocalDate` 的 JSON 序列化与反序列化。
     */
    private static JavaTimeModule getJavaTimeModule() {
        final JavaTimeModule timeModule = new JavaTimeModule();

        timeModule.addSerializer(LocalDateTime.class, new JsonSerializer<>() {
            @Override
            public void serialize(
                    final LocalDateTime value,
                    final JsonGenerator gen,
                    final SerializerProvider serializers
            ) throws IOException {
                gen.writeString(value.format(
                        DateTimeFormatter.ofPattern(Constants.DATE_TIME_PATTERN)
                ));
            }
        });

        timeModule.addDeserializer(LocalDateTime.class, new JsonDeserializer<>() {
            @Override
            public LocalDateTime deserialize(
                    final JsonParser p,
                    final DeserializationContext ctx
            ) throws IOException {
                return LocalDateTime.parse(p.getValueAsString(),
                        DateTimeFormatter.ofPattern(Constants.DATE_TIME_PATTERN));
            }
        });

        return timeModule;
    }
}
