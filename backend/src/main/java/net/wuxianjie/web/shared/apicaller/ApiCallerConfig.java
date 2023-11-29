package net.wuxianjie.web.shared.apicaller;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.client.RestClient;

/**
 * API 调用配置。
 */
@Configuration
@RequiredArgsConstructor
public class ApiCallerConfig {

  /**
   * 自定义的 `MappingJackson2HttpMessageConverter`。
   */
  private final MappingJackson2HttpMessageConverter mappingJackson2HttpMessageConverter;

  /**
   * 自定义的 `RestClient`。
   *
   * @return `RestClient` 实例
   */
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
