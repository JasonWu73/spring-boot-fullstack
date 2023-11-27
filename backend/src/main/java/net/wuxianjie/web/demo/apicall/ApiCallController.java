package net.wuxianjie.web.demo.apicall;

import lombok.RequiredArgsConstructor;
import net.wuxianjie.web.demo.requestparam.OuterData;
import net.wuxianjie.web.shared.exception.ApiError;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.util.Map;
import java.util.Objects;

/**
 * 测试 API 调用。
 */
@RestController
@RequestMapping("/api/v1/test/api-call")
@RequiredArgsConstructor
public class ApiCallController {

    private final WebClient webClient;

    @Value("${server.port}")
    private int port;

    /**
     * 发送 GET 请求。
     */
    @GetMapping("/params")
    public ResponseEntity<ApiCallResponse<?>> sendGetRequest() {
        // 构造请求参数
        final Map<String, String> params = Map.of(
                "name", "张三",
                "num", "123",
                "type", "1",
                "dateTime", "2021-01-01 12:00:00"
        );

        // 发送 GET 请求
        final ResponseEntity<OuterData> response;

        try {
            response = webClient
                    .get().uri(getBaseUrl() + "/api/v1/test/params", params)
                    .accept(MediaType.APPLICATION_JSON)
                    .retrieve()
                    .toEntity(OuterData.class).block();
        } catch (WebClientResponseException e) {
            // 读取并返回错误响应结果
            final ApiCallResponse<ApiError> errorResponse = new ApiCallResponse<>(
                    e.getStatusCode().value(),
                    e.getResponseBodyAs(ApiError.class)
            );

            return ResponseEntity.ok(errorResponse);
        }

        // 读取并返回响应结果
        final ApiCallResponse<OuterData> resultResponse = new ApiCallResponse<>(
                Objects.requireNonNull(response).getStatusCode().value(),
                response.getBody()
        );

        return ResponseEntity.ok(resultResponse);
    }


    private String getBaseUrl() {
        return "http://localhost:%s".formatted(port);
    }
}
