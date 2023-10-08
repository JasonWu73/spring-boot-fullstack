package net.wuxianjie.web.shared.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

/**
 * 需要将异常信息返回给客户端时使用的 API 异常.
 */
@Getter
public class ApiException extends RuntimeException {

  /**
   * 错误消息的分隔符.
   */
  public static final String MESSAGE_SEPARATOR = "; ";

  /**
   * 返回给客户端的 HTTP 错误状态码.
   */
  private final HttpStatus status;

  /**
   * 返回给客户端的错误信息.
   */
  private final String reason;

  /**
   * 构造 API 异常.
   *
   * @param status HTTP 状态码
   * @param reason 返回给客户端的错误信息
   */
  public ApiException(final HttpStatus status, final String reason) {
    super(reason);
    this.status = status;
    this.reason = reason;
  }

  /**
   * 构造 API 异常.
   *
   * @param status HTTP 状态码
   * @param reason 返回给客户端的错误信息
   * @param cause 导致该异常产生的异常
   */
  public ApiException(final HttpStatus status, final String reason, final Throwable cause) {
    super(reason, cause);
    this.status = status;
    this.reason = reason;
  }

  @Override
  public String getMessage() {
    final String message = String.format("%s \"%s\"", status, reason);

    final StringBuilder nestedMessage = getNestedMessage(getCause());

    if (nestedMessage == null) {
      return message;
    }

    return message + MESSAGE_SEPARATOR + nestedMessage;
  }

  private StringBuilder getNestedMessage(final Throwable cause) {
    if (cause == null) {
      return null;
    }

    final StringBuilder sb = new StringBuilder();

    sb.append("嵌套异常 [")
        .append(cause.getClass().getName())
        .append(": ")
        .append(cause.getMessage())
        .append("]");

    final StringBuilder nestedMessage = getNestedMessage(cause.getCause());

    if (nestedMessage == null) {
      return sb;
    }

    return sb.append(MESSAGE_SEPARATOR).append(nestedMessage);
  }
}
