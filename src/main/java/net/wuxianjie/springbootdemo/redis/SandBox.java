package net.wuxianjie.springbootdemo.redis;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

@Component
@RequiredArgsConstructor
public class SandBox implements CommandLineRunner {

  @Override
  public void run(String... args) {
    // ==== HTTP 请求 ====
    sendGet();

    sendPost();
  }

  private void sendPost() {
    Post resp = WebClient.create()
      .post()
      .uri("https://jsonplaceholder.typicode.com/posts")
      .contentType(MediaType.APPLICATION_JSON)
      .bodyValue(new Post("测试文章", "测试内容 balabalabala", 100))
      .retrieve()
      .bodyToMono(Post.class)
      .block();

    System.out.println("POST 请求结果: " + resp);
  }

  private void sendGet() {
    String resp = WebClient.create()
      .get()
      .uri("https://dummyjson.com/products/categories")
      .accept(MediaType.APPLICATION_JSON)
      .retrieve()
      .bodyToMono(String.class)
      .block();

    System.out.println("GET 请求结果: " + resp);
  }
}

record Post(String title, String body, Integer userId) {}