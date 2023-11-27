package net.wuxianjie.web.shared.apicaller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.Objects;

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
        final ResponseEntity<T> response;

        try {
            response = webClient
                    .get().uri(
                            url,
                            uriBuilder -> {
                                urlParams.forEach(uriBuilder::queryParam);

                                return uriBuilder.build();
                            }
                    )
                    .retrieve()
                    .toEntity(responseType).block();
        } catch (WebClientResponseException e) {
            // 读取并返回错误响应结果
            return new ApiResponse<>(
                    e.getStatusCode(),
                    null,
                    e.getResponseBodyAsString(StandardCharsets.UTF_8)
            );
        }

        // 读取并返回响应结果
        return new ApiResponse<>(
                Objects.requireNonNull(response).getStatusCode(),
                response.getBody(),
                null
        );
    }
}
