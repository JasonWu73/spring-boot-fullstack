package net.wuxianjie.web.shared.util;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import java.nio.charset.StandardCharsets;
import java.security.*;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;

public class RsaUtils {

  public static final String CRYPTO_ALGORITHM = "RSA";

  /**
   * 生成新的 RSA 1024 位密钥对。
   */
  public static RsaKeyPair generateKeyPair() {
    // 生成新的 RSA 1024 位密钥对
    final KeyPairGenerator rsa;
    try {
      rsa = KeyPairGenerator.getInstance(CRYPTO_ALGORITHM);
    } catch (NoSuchAlgorithmException e) {
      throw new RuntimeException("不支持 %s 加密算法".formatted(CRYPTO_ALGORITHM), e);
    }

    rsa.initialize(1024);

    // 生成密钥对
    final KeyPair keyPair = rsa.generateKeyPair();

    // 使用 Base64 编码密钥对
    return new RsaKeyPair(
      Base64.getEncoder().encodeToString(keyPair.getPublic().getEncoded()),
      Base64.getEncoder().encodeToString(keyPair.getPrivate().getEncoded())
    );
  }

  /**
   * 使用公钥加密字符串。
   */
  public static String encrypt(final String raw, final String publicKey) {
    // 获取加密 Cipher 实例
    final Cipher encryptCipher;
    try {
      encryptCipher = Cipher.getInstance(CRYPTO_ALGORITHM);
    } catch (NoSuchAlgorithmException | NoSuchPaddingException e) {
      throw new RuntimeException("不支持 %s 加密算法".formatted(CRYPTO_ALGORITHM), e);
    }

    try {
      encryptCipher.init(Cipher.ENCRYPT_MODE, getPublicKey(publicKey));
    } catch (InvalidKeyException e) {
      throw new RuntimeException("无效的公钥", e);
    }

    // 加密
    final byte[] messageBytes = raw.getBytes(StandardCharsets.UTF_8);
    final byte[] bytes;
    try {
      bytes = encryptCipher.doFinal(messageBytes);
    } catch (IllegalBlockSizeException | BadPaddingException e) {
      throw new RuntimeException(e);
    }

    // 使用 Base64 编码
    return Base64.getEncoder().encodeToString(bytes);
  }

  /**
   * 使用私钥解密字符串。
   */
  public static String decrypt(final String encrypted, final String privateKey) {
    // 获取解密 Cipher 实例
    final Cipher decryptCipher;
    try {
      decryptCipher = Cipher.getInstance(CRYPTO_ALGORITHM);
    } catch (NoSuchAlgorithmException | NoSuchPaddingException e) {
      throw new RuntimeException("不支持 %s 加密算法".formatted(CRYPTO_ALGORITHM), e);
    }

    try {
      decryptCipher.init(Cipher.DECRYPT_MODE, getPrivateKey(privateKey));
    } catch (InvalidKeyException e) {
      throw new RuntimeException("无效的私钥", e);
    }

    // 解密
    final byte[] encryptedBytes = Base64.getDecoder().decode(encrypted);
    final byte[] bytes;
    try {
      bytes = decryptCipher.doFinal(encryptedBytes);
    } catch (IllegalBlockSizeException | BadPaddingException e) {
      throw new RuntimeException(e);
    }

    return new String(bytes, StandardCharsets.UTF_8);
  }

  /**
   * 从 Base64 公钥字符串中获取公钥。
   */
  public static PublicKey getPublicKey(final String base64PublicKey) {
    final byte[] keyBytes = Base64.getDecoder().decode(base64PublicKey);
    final X509EncodedKeySpec keySpec = new X509EncodedKeySpec(keyBytes);

    final KeyFactory keyFactory;
    try {
      keyFactory = KeyFactory.getInstance(CRYPTO_ALGORITHM);
    } catch (NoSuchAlgorithmException e) {
      throw new RuntimeException("不支持 %s 加密算法".formatted(CRYPTO_ALGORITHM), e);
    }

    try {
      return keyFactory.generatePublic(keySpec);
    } catch (InvalidKeySpecException e) {
      throw new RuntimeException("无效的公钥: %s".formatted(base64PublicKey), e);
    }
  }

  /**
   * 从 Base64 私钥字符串中获取私钥。
   */
  public static PrivateKey getPrivateKey(final String base64PrivateKey) {
    final byte[] keyBytes = Base64.getDecoder().decode(base64PrivateKey);
    final PKCS8EncodedKeySpec keySpec = new PKCS8EncodedKeySpec(keyBytes);

    final KeyFactory keyFactory;
    try {
      keyFactory = KeyFactory.getInstance(CRYPTO_ALGORITHM);
    } catch (NoSuchAlgorithmException e) {
      throw new RuntimeException("不支持 %s 加密算法".formatted(CRYPTO_ALGORITHM), e);
    }

    try {
      return keyFactory.generatePrivate(keySpec);
    } catch (InvalidKeySpecException e) {
      throw new RuntimeException("无效的私钥: %s".formatted(base64PrivateKey), e);
    }
  }

  /**
   * RSA 密钥对。
   *
   * @param publicKey  Base64 公钥字符串
   * @param privateKey Base64 私钥字符串
   */
  public record RsaKeyPair(String publicKey, String privateKey) {}
}
