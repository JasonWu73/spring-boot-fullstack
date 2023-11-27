package net.wuxianjie.web.demo.apicall;

import lombok.RequiredArgsConstructor;
import net.wuxianjie.web.demo.requestparam.InnerData;
import net.wuxianjie.web.demo.requestparam.OuterData;
import net.wuxianjie.web.demo.requestparam.Uploaded;
import net.wuxianjie.web.shared.exception.ApiError;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ResourceLoader;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.MultipartBodyBuilder;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.Map;
import java.util.Objects;

/**
 * 测试常用的 API 调用方式。
 */
@RestController
@RequestMapping("/api/v1/test/api-call")
@RequiredArgsConstructor
public class ApiCallController {

    private final ResourceLoader resourceLoader;

    private final WebClient webClient;

    @Value("${server.port}")
    private int port;

    /**
     * GET URL 传参。
     */
    @GetMapping("/params")
    public ApiCallResponse<?> sendGetRequest() {
        // 构造请求参数
        final Map<String, String> urlParams = Map.of(
                "name", "张三",
                "num", "123",
                "type", "1",
                "dateTime", "2021-01-01 12:00:00"
        );

        // 发送 GET 请求
        final ResponseEntity<OuterData> response;

        try {
            response = getWebClient()
                    .get().uri(
                            uriBuilder -> {
                                uriBuilder.path("/api/v1/test/params");
                                urlParams.forEach(uriBuilder::queryParam);

                                return uriBuilder.build();
                            }
                    )
                    .retrieve()
                    .toEntity(OuterData.class).block();
        } catch (WebClientResponseException e) {
            // 读取并返回错误响应结果
            return new ApiCallResponse<>(
                    e.getStatusCode().value(),
                    e.getResponseBodyAs(ApiError.class)
            );
        }

        // 读取并返回响应结果
        return new ApiCallResponse<>(
                Objects.requireNonNull(response).getStatusCode().value(),
                response.getBody()
        );
    }

    /**
     * POST x-www-form-urlencoded 传参（仅支持文本）。
     */
    @PostMapping("/form")
    public ApiCallResponse<?> sendPostFormRequest() {
        // 构造请求参数
        final MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();

        formData.add("name", "张三");
        formData.add("num", "123");
        formData.add("type", "1");
        formData.add("dateTime", "2021-01-01 12:00:00");

        // 发送 POST 表单请求
        final ResponseEntity<OuterData> response;

        try {
            response = getWebClient()
                    .post().uri("/api/v1/test/params")
                    .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                    .bodyValue(formData)
                    .retrieve()
                    .toEntity(OuterData.class).block();
        } catch (WebClientResponseException e) {
            // 读取并返回错误响应结果
            return new ApiCallResponse<>(
                    e.getStatusCode().value(),
                    e.getResponseBodyAs(ApiError.class)
            );
        }

        // 读取并返回响应结果
        return new ApiCallResponse<>(
                Objects.requireNonNull(response).getStatusCode().value(),
                response.getBody()
        );
    }

    /**
     * POST JSON 传参。
     */
    @PostMapping("/json")
    public ApiCallResponse<?> sendPostJsonRequest() {
        // 构造请求参数
        final OuterData jsonData = new OuterData(
                100L,
                "张三",
                new InnerData(
                        new Date(),
                        LocalDate.now(),
                        LocalDateTime.now()
                )
        );

        // 发送 POST JSON 请求
        final ResponseEntity<OuterData> response;

        try {
            response = getWebClient()
                    .post().uri("/api/v1/test/params/json")
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(jsonData)
                    .retrieve()
                    .toEntity(OuterData.class).block();
        } catch (WebClientResponseException e) {
            // 读取并返回错误响应结果
            return new ApiCallResponse<>(
                    e.getStatusCode().value(),
                    e.getResponseBodyAs(ApiError.class)
            );
        }

        // 读取并返回响应结果
        return new ApiCallResponse<>(
                Objects.requireNonNull(response).getStatusCode().value(),
                response.getBody()
        );
    }

    /**
     * POST form-data 传参（支持文本和文件）。
     */
    @PostMapping("/upload")
    public ApiCallResponse<?> sendPostUploadRequest() {
        // 构造请求参数
        final MultipartBodyBuilder formData = new MultipartBodyBuilder();
        formData.part("message", "测试上传文件");
        formData.part(
                "file",
                resourceLoader.getResource("file:/Users/wxj/Downloads/README.md")
        );

        // 发送 POST 表单请求
        final ResponseEntity<Uploaded> response;

        try {
            response = getWebClient()
                    .post().uri("/api/v1/test/params/upload")
                    .contentType(MediaType.MULTIPART_FORM_DATA)
                    .body(BodyInserters.fromMultipartData(formData.build()))
                    .retrieve()
                    .toEntity(Uploaded.class).block();
        } catch (WebClientResponseException e) {
            // 读取并返回错误响应结果
            return new ApiCallResponse<>(
                    e.getStatusCode().value(),
                    e.getResponseBodyAs(ApiError.class)
            );
        }

        // 读取并返回响应结果
        return new ApiCallResponse<>(
                Objects.requireNonNull(response).getStatusCode().value(),
                response.getBody()
        );
    }

    private WebClient getWebClient() {
        return webClient
                .mutate()
                .baseUrl("http://localhost:%s".formatted(port))
                .build();
    }
}