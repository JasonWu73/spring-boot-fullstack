package net.wuxianjie.springbootdemo.shared.restapi;

import org.springframework.http.HttpStatus;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.time.LocalDateTime;
import java.util.Objects;

public record ResponseData (LocalDateTime timestamp, int status, String error, String path) {

  public ResponseData(HttpStatus status, String error) {
    this(LocalDateTime.now(), status.value(), error, getRequestPath());
  }

  private static String getRequestPath() {
    ServletRequestAttributes sra = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
    return Objects.requireNonNull(sra).getRequest().getRequestURI();
  }
}
