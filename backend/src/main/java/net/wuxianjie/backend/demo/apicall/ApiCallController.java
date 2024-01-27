package net.wuxianjie.backend.demo.apicall;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import net.wuxianjie.backend.demo.requestparam.InnerData;
import net.wuxianjie.backend.demo.requestparam.OuterData;
import net.wuxianjie.backend.demo.requestparam.Uploaded;
import net.wuxianjie.backend.shared.apicaller.ApiCaller;
import net.wuxianjie.backend.shared.apicaller.ApiResponse;
import net.wuxianjie.backend.shared.json.JsonConfig;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ResourceLoader;
import org.springframework.http.HttpMethod;
import org.springframework.http.client.MultipartBodyBuilder;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 测试几种常用的 API 调用方式。
 */
@RestController
@RequestMapping("/api/v1/public/api-call")
@RequiredArgsConstructor
public class ApiCallController {

  private final ResourceLoader resourceLoader;

  private final ApiCaller apiCaller;

  @Value("${server.port}")
  private int port;

  /**
   * GET URL 传参。
   */
  @GetMapping("/params")
  public ApiResponse<OuterData> sendGetRequest() {
    final Map<String, String> urlParams = Map.of(
      "name",
      "张三",
      "num",
      "123",
      "type",
      "1",
      "dateTime",
      getNow()
    );;
    return apiCaller.get(
      "http://localhost:%s/api/v1/public/params".formatted(port),
      urlParams,
      OuterData.class
    );
  }

  /**
   * POST x-www-form-urlencoded 传参（仅支持文本）。
   */
  @PostMapping("/form")
  public ApiResponse<OuterData> sendPostFormRequest() {
    final LinkedMultiValueMap<String, String> formData = getSendPostFormRequestParams();
    return apiCaller.form(
      HttpMethod.POST,
      "http://localhost:%s/api/v1/public/params".formatted(port),
      formData,
      OuterData.class
    );
  }

  /**
   * POST form-data 传参（支持文本和文件）。
   */
  @PostMapping("/upload")
  public ApiResponse<Uploaded> sendPostUploadRequest() {
    final MultipartBodyBuilder formDataBuilder = getSendPostUploadRequest();
    return apiCaller.upload(
      HttpMethod.POST,
      "http://localhost:%s/api/v1/public/params/upload".formatted(port),
      formDataBuilder,
      Uploaded.class
    );
  }

  /**
   * POST JSON 传参。
   */
  @PostMapping("/json")
  public ApiResponse<OuterData> sendPostJsonRequest() {
    final OuterData jsonData = new OuterData(
      100L,
      "张三",
      new InnerData(new Date(), LocalDate.now(), LocalDateTime.now())
    );
    return apiCaller.json(
      HttpMethod.POST,
      "http://localhost:%s/api/v1/public/params/json".formatted(port),
      jsonData,
      OuterData.class
    );
  }

  private static LinkedMultiValueMap<String, String> getSendPostFormRequestParams() {
    final LinkedMultiValueMap<String, String> formData = new LinkedMultiValueMap<>();
    formData.add("name", "张三");
    formData.add("num", "123");
    formData.add("type", "1");
    formData.add("dateTime", getNow());
    return formData;
  }

  private MultipartBodyBuilder getSendPostUploadRequest() {
    final MultipartBodyBuilder formDataBuilder = new MultipartBodyBuilder();
    formDataBuilder.part("message", "测试上传文件");
    formDataBuilder.part(
      "file",
      resourceLoader.getResource("file:/Users/wxj/Downloads/README.md")
    );
    return formDataBuilder;
  }

  private static String getNow() {
    return LocalDateTime
      .now()
      .format(DateTimeFormatter.ofPattern(JsonConfig.DATE_TIME_PATTERN));
  }
}
