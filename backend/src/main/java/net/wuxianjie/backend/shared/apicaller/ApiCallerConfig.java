package net.wuxianjie.backend.shared.apicaller;

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
   * 注入自定义的 {@link MappingJackson2HttpMessageConverter}。
   */
  private final MappingJackson2HttpMessageConverter mappingJackson2HttpMessageConverter;

  /**
   * 自定义符合以下条件的 {@link RestClient} 实例：
   *
   * <ul>
   *   <li>只接收 JSON 响应结果</li>
   *   <li>使用自定义的 JSON 解析策略</li>
   * </ul>
   *
   * @return {@link RestClient} 实例
   */
  @Bean
  public RestClient restClient() {
    return RestClient
      .builder()
      .defaultHeader(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
      .messageConverters(converters ->
        converters.add(0, mappingJackson2HttpMessageConverter)
      )
      .build();
  }
}
