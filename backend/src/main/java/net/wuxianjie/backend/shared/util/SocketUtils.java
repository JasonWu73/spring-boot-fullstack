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

/**
 * 网络 Socket 工具类。
 */
public class SocketUtils {

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

      // ❗一定要关闭输出流，否则服务端的 `read` 方法会一直阻塞
      client.shutdownOutput();

      // ----- 读取服务端的响应数据 -----
      // 设置最长数据读取时间
      client.setSoTimeout(readTimeout);

      return read(client.getInputStream());
    } catch (IOException e) {
      throw new RuntimeException(
        "TCP 通信失败 [ip=%s;port=%s;hexData=%s]".formatted(ip, port, StrUtils.toHex(data)),
        e
      );
    }
  }

  /**
   * 发送 UDP 数据包。
   * <p>
   * 默认读取超时时间为 2 秒。
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

      return Optional.ofNullable(read(client, packet));
    } catch (IOException e) {
      throw new RuntimeException(
        "UDP 通信失败 [ip=%s;port=%s;hexData=%s]".formatted(ip, port, StrUtils.toHex(data)),
        e
      );
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
    try {
      final ByteArrayOutputStream output = new ByteArrayOutputStream();

      // ❗️要重置缓存区，否则会导致数据读取不完整
      packet.setData(new byte[BUFFER_SIZE]);

      do {
        client.receive(packet);
        output.write(packet.getData(), packet.getOffset(), packet.getLength());
      } while (packet.getLength() >= BUFFER_SIZE);

      return output.toByteArray();
    } catch (SocketTimeoutException e) {
      // 如果服务端超时没有响应，则返回空数据
      return null;
    }
  }
}
