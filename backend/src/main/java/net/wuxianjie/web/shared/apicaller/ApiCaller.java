package net.wuxianjie.web.shared.apicaller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.MultipartBodyBuilder;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.function.Supplier;

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
   * @param url          请求地址
   * @param urlParams    URL 参数
   * @param responseType 响应结果类型
   * @param <T>          响应结果类型
   * @return 响应结果
   */
  public <T> ApiResponse<T> sendGetRequest(
    final String url,
    final Map<String, String> urlParams,
    final Class<T> responseType
  ) {
    return executeRequest(() -> restClient
      .get()
      .uri(url, uriBuilder -> {
        urlParams.forEach(uriBuilder::queryParam);

        return uriBuilder.build();
      })
      .retrieve()
      .toEntity(responseType)
    );
  }

  /**
   * 发送 HTTP x-www-form-urlencoded 请求。
   *
   * @param method       请求方法
   * @param url          请求地址
   * @param formData     表单请求体
   * @param responseType 响应结果类型
   * @param <T>          响应结果类型
   * @return 响应结果
   */
  public <T> ApiResponse<T> sendFormRequest(
    final HttpMethod method,
    final String url,
    final LinkedMultiValueMap<String, String> formData,
    final Class<T> responseType) {
    return executeRequest(() -> restClient
      .method(method)
      .uri(url)
      .contentType(MediaType.APPLICATION_FORM_URLENCODED)
      .body(formData)
      .retrieve()
      .toEntity(responseType)
    );
  }

  /**
   * 发送 HTTP form-data 请求。
   *
   * @param method          请求方法
   * @param url             请求地址
   * @param formDataBuilder 表单请求体生成器
   * @param responseType    响应结果类型
   * @param <T>             响应结果类型
   * @return 响应结果
   */
  public <T> ApiResponse<T> sendUploadRequest(
    final HttpMethod method,
    final String url,
    final MultipartBodyBuilder formDataBuilder,
    final Class<T> responseType
  ) {
    return executeRequest(() -> restClient
      .method(method)
      .uri(url)
      .contentType(MediaType.MULTIPART_FORM_DATA)
      .body(formDataBuilder.build())
      .retrieve()
      .toEntity(responseType)
    );
  }

  /**
   * 发送 HTTP JSON 请求。
   *
   * @param method       请求方法
   * @param url          请求地址
   * @param jsonData     JSON 请求体
   * @param responseType 响应结果类型
   * @param <T>          响应结果类型
   * @return 响应结果
   */
  public <T> ApiResponse<T> sendJsonRequest(
    final HttpMethod method,
    final String url,
    final Object jsonData,
    final Class<T> responseType
  ) {
    return executeRequest(() -> restClient
      .method(method)
      .uri(url)
      .contentType(MediaType.APPLICATION_JSON)
      .body(jsonData)
      .retrieve()
      .toEntity(responseType)
    );
  }

  public <T> ApiResponse<T> executeRequest(
    final Supplier<ResponseEntity<T>> requestSupplier
  ) {
    try {
      ResponseEntity<T> response = requestSupplier.get();

      return new ApiResponse<>(
        response.getStatusCode(),
        response.getBody(),
        null
      );
    } catch (RestClientResponseException e) {
      return new ApiResponse<>(
        e.getStatusCode(),
        null,
        e.getResponseBodyAsString(StandardCharsets.UTF_8)
      );
    }
  }
}
