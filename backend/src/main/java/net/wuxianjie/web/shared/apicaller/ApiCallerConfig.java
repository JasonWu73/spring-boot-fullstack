package net.wuxianjie.web.shared.apicaller;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import net.wuxianjie.web.shared.config.JsonConfig;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.codec.json.Jackson2JsonDecoder;
import org.springframework.http.codec.json.Jackson2JsonEncoder;
import org.springframework.web.reactive.function.client.WebClient;

/**
 * 配置 {@code WebClient}。
 */
@Configuration
@RequiredArgsConstructor
public class ApiCallerConfig {

    /**
     * 注入自定义的 {@link JsonConfig#objectMapper()}。
     */
    private final ObjectMapper objectMapper;

    /**
     * 配置 {@code WebClient} 使用指定的 {@code ObjectMapper}。
     *
     * @return {@code WebClient}
     */
    @Bean
    public WebClient webClient() {
        return WebClient.builder()
                .codecs(configurer -> {
                            configurer.defaultCodecs().jackson2JsonDecoder(
                                    new Jackson2JsonDecoder(objectMapper)
                            );
                            configurer.defaultCodecs().jackson2JsonEncoder(
                                    new Jackson2JsonEncoder(objectMapper)
                            );
                        }
                )
                // 默认请求只接收 JSON 响应结果
                .defaultHeader(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
                .build();
    }
}
