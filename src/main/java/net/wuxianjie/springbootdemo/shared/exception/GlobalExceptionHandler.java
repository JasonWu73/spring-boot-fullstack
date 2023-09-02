package net.wuxianjie.springbootdemo.shared.exception;

import net.wuxianjie.springbootdemo.shared.restapi.ResponseData;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(ApiException.class)
  public ResponseEntity<ResponseData> handleApiException(ApiException e) {
    ResponseData data= new ResponseData(e.getStatus(), e.getMessage());

    return ResponseEntity.status(e.getStatus()).body(data);
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ResponseData> handleMethodArgumentNotValid(MethodArgumentNotValidException e) {
    StringBuilder sb = new StringBuilder();

    e.getBindingResult().getFieldErrors().forEach(error -> {
      if (!sb.isEmpty()) {
        sb.append(";");
      }
      sb.append(error.getDefaultMessage());
    });

    HttpStatus status = HttpStatus.BAD_REQUEST;

    return ResponseEntity.status(status).body(new ResponseData(status, sb.toString()));
  }
}
