package net.wuxianjie.backend.shared.util;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;
import java.net.InetSocketAddress;
import java.net.Socket;
import java.net.SocketTimeoutException;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

/**
 * 网络 Socket 工具类。
 */
public class SocketUtils {

  /**
   * 缓存区大小，单位：字节。
   * <p>
   * TCP 通信时，该值决定了一次读取的最大数据量，但一定会读取完所有数据。而 UDP 通信时，该值决定了读取的最大数据量，因为仅读取一次。
   */
  private static final int BUFFER_SIZE = 1024;

  /**
   * 发送 TCP 数据包。
   * <p>
   * 默认 2 秒的等待连接时间，5 秒的读取超时时间。
   *
   * @param ip TCP 服务端 IP
   * @param port TCP 服务端端口
   * @param data 要发送的数据
   * @return TCP 服务端的响应结果
   */
  public static byte[] sendTcp(
    final String ip,
    final int port,
    final byte[] data
  ) {
    return sendTcp(ip, port, data, 2_000, 5_000);
  }

  /**
   * 发送 TCP 数据包。
   *
   * @param ip TCP 服务端 IP
   * @param port TCP 服务端端口
   * @param data 要发送的数据
   * @param connectTimeout 连接超时时间，单位：毫秒
   * @param readTimeout 读取超时时间，单位：毫秒
   * @return TCP 服务端的响应结果
   */
  public static byte[] sendTcp(
    final String ip,
    final int port,
    final byte[] data,
    final int connectTimeout,
    final int readTimeout
  ) {
    // 创建 TCP 客户端
    try (final Socket client = new Socket()) {
      // 连接服务端，并设置最长等待连接时间
      client.connect(new InetSocketAddress(ip, port), connectTimeout);

      // ----- 向服务端发送数据 -----
      final OutputStream output = client.getOutputStream();
      output.write(data);
      output.flush();

      // ❗一定要关闭输出流（发送 FIN 包），否则服务端的 `read` 方法会一直阻塞
      // 这里等待一小段时间再关闭输出流，以确保服务端能够接收到数据
      try {
        TimeUnit.MILLISECONDS.sleep(50);
      } catch (InterruptedException e) {
        throw new RuntimeException(e);
      }
      client.shutdownOutput();

      // ----- 读取服务端的响应数据 -----
      // 设置最长数据读取时间
      client.setSoTimeout(readTimeout);

      return read(client.getInputStream());
    } catch (IOException e) {
      throw new RuntimeException(e);
    }
  }

  /**
   * 发送 UDP 数据包。
   * <p>
   * 默认读取超时时间为 2 秒。
   * <p>
   * UDP 是一种面向无连接的协议，故数据包是否发送成功，客户端无从得知（除非服务端有返回数据），这也意味着无法判定 UDP 是否通信成功。
   *
   * @param ip UDP 服务端 IP
   * @param port UDP 服务端端口
   * @param data 要发送的数据
   * @return UDP 服务端的响应结果
   */
  public static Optional<byte[]> sendUdp(
    final String ip,
    final int port,
    final byte[] data
  ) {
    return sendUdp(ip, port, data, 2_000);
  }

  /**
   * 发送 UDP 数据包。
   * <p>
   * 当读取超时时，则认为服务端没有响应数据。
   * <p>
   * UDP 是一种面向无连接的协议，故数据包是否发送成功，客户端无从得知（除非服务端有返回数据），这也意味着无法判定 UDP 是否通信成功。
   *
   * @param ip UDP 服务端 IP
   * @param port UDP 服务端端口
   * @param data 要发送的数据
   * @param readTimeout 读取超时时间，单位：毫秒
   * @return UDP 服务端的响应结果
   */
  public static Optional<byte[]> sendUdp(
    final String ip,
    final int port,
    final byte[] data,
    final int readTimeout
  ) {
    // 创建 UDP 客户端
    try (final DatagramSocket client = new DatagramSocket()) {

      // ----- 向服务端发送数据 -----
      final InetAddress destination = InetAddress.getByName(ip);
      final DatagramPacket packet = new DatagramPacket(data, data.length, destination, port);
      client.send(packet);

      // ----- 读取服务端的响应数据 -----
      // 设置较短的最长数据读取时间
      // 与 TCP 不同，UDP 是面向无连接的协议，故这里约定超时就代表没有响应数据
      client.setSoTimeout(readTimeout);

      // 使用已设置地址的 `DatagramPacket`，从而实现只接收目标服务端的响应数据
      return Optional.ofNullable(read(client, packet));
    } catch (IOException e) {
      throw new RuntimeException(e);
    }
  }

  private static byte[] read(final InputStream input) throws IOException {
    final byte[] buffer = new byte[BUFFER_SIZE];
    final ByteArrayOutputStream output = new ByteArrayOutputStream();
    int readLength;

    while ((readLength = input.read(buffer)) != -1) {
      output.write(buffer, 0, readLength);
    }

    return output.toByteArray();
  }

  private static byte[] read(
    final DatagramSocket client,
    final DatagramPacket packet
  ) throws IOException {
    final ByteArrayOutputStream output = new ByteArrayOutputStream();

    try {
      // ❗️因为只读取一次，故预设的缓存区大小将影响能读取的最多数据量
      packet.setData(new byte[BUFFER_SIZE]);

      client.receive(packet);
      output.write(packet.getData(), packet.getOffset(), packet.getLength());

      return output.toByteArray();
    } catch (SocketTimeoutException e) {
      // 如果读取 UDP 服务端响应数据超时，则认为服务端没有响应数据
      // 这里不能判定为通信失败，因为 UDP 是面向无连接的协议
      return null;
    }
  }
}
