package net.wuxianjie.springbootdemo.shared.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

public class ApiException extends RuntimeException {

  @Getter
  private final HttpStatus status;

  public ApiException(HttpStatus status, String message) {
    super(message);
    this.status = status;
  }

  public ApiException(HttpStatus status, String message, Throwable cause) {
    super(message, cause);
    this.status = status;
  }
}
