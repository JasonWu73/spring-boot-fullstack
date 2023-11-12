package net.wuxianjie.web.shared.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class ApiException extends RuntimeException {

  public static final String MESSAGE_SEPARATOR = "; ";

  private final HttpStatus status;
  private final String reason;

  public ApiException(final HttpStatus status, final String reason) {
    super(reason);
    this.status = status;
    this.reason = reason;
  }

  public ApiException(final HttpStatus status, final String reason, final Throwable cause) {
    super(reason, cause);
    this.status = status;
    this.reason = reason;
  }

  @Override
  public String getMessage() {
    final String message = "%s \"%s\"".formatted(status, reason);
    final StringBuilder nestedMessage = getNestedMessage(getCause());
    if (nestedMessage == null) return message;

    return message + MESSAGE_SEPARATOR + nestedMessage;
  }

  private StringBuilder getNestedMessage(final Throwable cause) {
    if (cause == null) return null;

    final StringBuilder sb = new StringBuilder();
    sb.append("嵌套异常 [")
      .append(cause.getClass().getName())
      .append(": ")
      .append(cause.getMessage())
      .append("]");

    final StringBuilder nestedMessage = getNestedMessage(cause.getCause());
    if (nestedMessage == null) return sb;

    return sb.append(MESSAGE_SEPARATOR).append(nestedMessage);
  }
}
