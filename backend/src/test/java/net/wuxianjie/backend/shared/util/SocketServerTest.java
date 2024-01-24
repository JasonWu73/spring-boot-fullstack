package net.wuxianjie.backend.shared.util;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.ServerSocket;
import java.net.Socket;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

@Disabled
class SocketServerTest {

  private static final int BUFFER_SIZE = 1024;

  @Test
  void startTcpServer() throws IOException {
    try (final ServerSocket server = new ServerSocket(8000)) {
      while (true) {
        try (final Socket client = server.accept()) {
          System.out.printf("连接成功: %s%n", client.getRemoteSocketAddress());

          final InputStream input = client.getInputStream();
          final String received = read(input);
          System.out.printf("接收数据: %s%n", received);

          final OutputStream output = client.getOutputStream();
          final String response = "已接收到数据 🎉: " + received;
          output.write(response.getBytes());
        }
      }
    }
  }

  @Test
  void startUdpServer() throws IOException {
    try (final DatagramSocket server = new DatagramSocket(8000)) {
      while (true) {
        final byte[] buffer = new byte[BUFFER_SIZE];
        final DatagramPacket packet = new DatagramPacket(buffer, buffer.length);

        final String received = read(server, packet);
        System.out.printf("接收到来自 %s 的数据: %s%n", packet.getSocketAddress(), received);

        final String response = "已接收到数据 🎉: " + received;
        packet.setData(response.getBytes());
        server.send(packet);
      }
    }
  }

  private String read(final InputStream input) throws IOException {
    final byte[] buffer = new byte[BUFFER_SIZE];
    final ByteArrayOutputStream output = new ByteArrayOutputStream();
    int readBytes;

    while ((readBytes = input.read(buffer)) != -1) {
      output.write(buffer, 0, readBytes);
    }

    return output.toString();
  }

  private String read(
    final DatagramSocket server,
    final DatagramPacket packet
  ) throws IOException {
    final ByteArrayOutputStream output = new ByteArrayOutputStream();

    do {
      server.receive(packet);
      output.write(packet.getData(), packet.getOffset(), packet.getLength());
    } while (packet.getLength() >= BUFFER_SIZE);

    return output.toString();
  }
}
