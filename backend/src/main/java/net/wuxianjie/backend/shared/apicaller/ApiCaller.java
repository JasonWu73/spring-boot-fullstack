package net.wuxianjie.backend.shared.apicaller;

import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.function.Supplier;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.MultipartBodyBuilder;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

/**
 * API 调用工具类。
 */
@Component
@RequiredArgsConstructor
public class ApiCaller {

  private final RestClient restClient;

  /**
   * 发送 HTTP GET 请求。
   *
   * @param url 请求地址
   * @param urlParams URL 参数
   * @param responseType 响应结果的类类型
   * @param <T> 响应结果的泛型类型参数
   * @return 响应结果
   */
  public <T> ApiResponse<T> get(
    final String url,
    final Map<String, String> urlParams,
    final Class<T> responseType
  ) {
    return getResponse(() -> restClient
      .get()
      .uri(url, uriBuilder -> {
        urlParams.forEach(uriBuilder::queryParam);
        return uriBuilder.build();
      })
      .retrieve()
      .toEntity(responseType));
  }

  /**
   * 发送 HTTP x-www-form-urlencoded 请求。
   *
   * @param method 请求方法
   * @param url 请求地址
   * @param formData 表单请求体
   * @param responseType 响应结果的类类型
   * @param <T> 响应结果的泛型类型参数
   * @return 响应结果
   */
  public <T> ApiResponse<T> form(
    final HttpMethod method,
    final String url,
    final LinkedMultiValueMap<String, String> formData,
    final Class<T> responseType
  ) {
    return getResponse(() -> restClient
      .method(method)
      .uri(url)
      .contentType(MediaType.APPLICATION_FORM_URLENCODED)
      .body(formData)
      .retrieve()
      .toEntity(responseType));
  }

  /**
   * 发送 HTTP form-data 请求。
   *
   * @param method 请求方法
   * @param url 请求地址
   * @param formDataBuilder 表单请求体生成器
   * @param responseType 响应结果的类类型
   * @param <T> 响应结果的泛型类型参数
   * @return 响应结果
   */
  public <T> ApiResponse<T> upload(
    final HttpMethod method,
    final String url,
    final MultipartBodyBuilder formDataBuilder,
    final Class<T> responseType
  ) {
    return getResponse(() -> restClient
      .method(method)
      .uri(url)
      .contentType(MediaType.MULTIPART_FORM_DATA)
      .body(formDataBuilder.build())
      .retrieve()
      .toEntity(responseType));
  }

  /**
   * 发送 HTTP JSON 请求。
   *
   * @param method 请求方法
   * @param url 请求地址
   * @param jsonData JSON 请求体
   * @param responseType 响应结果的类类型
   * @param <T> 响应结果的泛型类型参数
   * @return 响应结果
   */
  public <T> ApiResponse<T> json(
    final HttpMethod method,
    final String url,
    final Object jsonData,
    final Class<T> responseType
  ) {
    return getResponse(() -> restClient
      .method(method)
      .uri(url)
      .contentType(MediaType.APPLICATION_JSON)
      .body(jsonData)
      .retrieve()
      .toEntity(responseType));
  }

  public <T> ApiResponse<T> getResponse(final Supplier<ResponseEntity<T>> responseSupplier) {
    try {
      final ResponseEntity<T> response = responseSupplier.get();
      return new ApiResponse<>(
        response.getStatusCode(),
        response.getBody(),
        null
      );
    } catch (RestClientResponseException e) {
      return new ApiResponse<>(
        e.getStatusCode(),
        null,
        e.getResponseBodyAsString(StandardCharsets.UTF_8) // 指定默认编码，以免中文乱码
      );
    }
  }
}
