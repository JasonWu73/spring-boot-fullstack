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

/**
 * 网络 Socket 工具类。
 */
public class SocketUtils {

  private static final int BUFFER_SIZE = 1024;

  /**
   * 发送 TCP 数据包。
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
    // 创建 TCP 客户端
    try (final Socket client = new Socket()) {
      // 连接服务端，并设置 3 秒的最长等待连接时间
      client.connect(new InetSocketAddress(ip, port), 3_000);

      // ----- 向服务端发送数据 -----
      final OutputStream output = client.getOutputStream();
      output.write(data);
      output.flush();

      // ❗一定要关闭输出流，否则服务端的 `read` 方法会一直阻塞
      client.shutdownOutput();

      // ----- 读取服务端的响应数据 -----
      // 设置 2 秒的最长数据读取时间
      client.setSoTimeout(2_000);

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
   *
   * @param ip UDP 服务端 IP
   * @param port UDP 服务端端口
   * @param data 要发送的数据
   * @return UDP 服务端的响应结果
   */
  public static byte[] sendUdp(
    final String ip,
    final int port,
    final byte[] data
  ) {
    // 创建 UDP 客户端
    try (final DatagramSocket client = new DatagramSocket()) {

      // ----- 向服务端发送数据 -----
      final InetAddress destination = InetAddress.getByName(ip);
      final DatagramPacket packet = new DatagramPacket(data, data.length, destination, port);
      client.send(packet);

      // ----- 读取服务端的响应数据 -----
      // 设置 2 秒的最长数据读取时间
      client.setSoTimeout(2_000);

      return read(client, packet);
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
    final ByteArrayOutputStream output = new ByteArrayOutputStream();

    // ❗️要重置缓存区，否则会导致数据读取不完整
    packet.setData(new byte[BUFFER_SIZE]);

    do {
      client.receive(packet);
      output.write(packet.getData(), packet.getOffset(), packet.getLength());
    } while (packet.getLength() >= BUFFER_SIZE);

    return output.toByteArray();
  }
}
