package net.wuxianjie.web.shared.apicaller;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.client.RestClient;

@Configuration
@RequiredArgsConstructor
public class ApiCallerConfig {

  private final MappingJackson2HttpMessageConverter mappingJackson2HttpMessageConverter;

  @Bean
  public RestClient restClient() {
    return RestClient
        .builder()
        // 默认请求只接收 JSON 响应结果
        .defaultHeader(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
        // 注入自定义的 `MappingJackson2HttpMessageConverter`
        .messageConverters(converters ->
            converters.add(0, mappingJackson2HttpMessageConverter)
        )
        .build();
  }
}
