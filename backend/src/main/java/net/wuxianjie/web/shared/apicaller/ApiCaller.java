package net.wuxianjie.web.shared.apicaller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.MultipartBodyBuilder;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.function.Supplier;

/**
 * 使用 {@link WebClient} 发送 HTTP 请求。
 */
@Component
@RequiredArgsConstructor
public class ApiCaller {

    /**
     * 注入自定义的 {@link WebClient}。
     */
    private final WebClient webClient;

    /**
     * 发送 HTTP GET 请求。
     *
     * @param url          请求地址
     * @param urlParams    URL 参数
     * @param responseType 响应结果类型
     * @param <T>          响应结果类型
     * @return 响应结果
     */
    public <T> ApiResponse<T> getRequest(
            final String url,
            final Map<String, String> urlParams,
            final Class<T> responseType
    ) {
        return executeRequest(() -> webClient
                .get().uri(url, uriBuilder -> {
                    urlParams.forEach(uriBuilder::queryParam);

                    return uriBuilder.build();
                })
                .retrieve()
                .toEntity(responseType).block()
        );
    }

    /**
     * 发送 HTTP POST x-www-form-urlencoded 请求。
     *
     * @param url          请求地址
     * @param formData     表单请求体
     * @param responseType 响应结果类型
     * @param <T>          响应结果类型
     * @return 响应结果
     */
    public <T> ApiResponse<T> postFormRequest(
            final String url,
            final LinkedMultiValueMap<String, String> formData,
            final Class<T> responseType) {
        return executeRequest(() -> webClient
                .post().uri(url)
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(BodyInserters.fromFormData(formData))
                .retrieve()
                .toEntity(responseType).block()
        );
    }

    /**
     * 发送 HTTP POST form-data 请求。
     *
     * @param url             请求地址
     * @param formDataBuilder 表单请求体生成器
     * @param responseType    响应结果类型
     * @param <T>             响应结果类型
     * @return 响应结果
     */
    public <T> ApiResponse<T> postUploadRequest(
            final String url,
            final MultipartBodyBuilder formDataBuilder,
            final Class<T> responseType
    ) {
        return executeRequest(() -> webClient
                .post().uri(url)
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .body(BodyInserters.fromMultipartData(formDataBuilder.build()))
                .retrieve()
                .toEntity(responseType).block()
        );
    }

    /**
     * 发送 HTTP POST JSON 请求。
     *
     * @param url          请求地址
     * @param jsonData     JSON 请求体
     * @param responseType 响应结果类型
     * @param <T>          响应结果类型
     * @return 响应结果
     */
    public <T> ApiResponse<T> postJsonRequest(
            final String url,
            final Object jsonData,
            final Class<T> responseType
    ) {
        return executeRequest(() -> webClient
                .post().uri(url)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(jsonData)
                .retrieve()
                .toEntity(responseType).block()
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
        } catch (WebClientResponseException e) {
            return new ApiResponse<>(
                    e.getStatusCode(),
                    null,
                    e.getResponseBodyAsString(StandardCharsets.UTF_8)
            );
        }
    }
}
