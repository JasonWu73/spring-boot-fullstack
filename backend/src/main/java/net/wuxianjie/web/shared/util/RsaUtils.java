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

/**
 * RSA 加密工具类。
 */
public class RsaUtils {

  /**
   * RSA 加密算法。
   */
  public static final String RSA_CRYPTO_ALGORITHM = "RSA";

  /**
   * 生成新的 RSA 1024 位密钥对。
   *
   * @return Base64 公钥和私钥
   */
  public static RsaKeyPair generateKeyPair() {
    // 获取 RSA 密钥对生成器
    final KeyPairGenerator rsa = getKeyPairGenerator();

    // 初始化 RSA 密钥对生成器，设置其生成 2048 位长的密钥对
    rsa.initialize(2048);

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
   *
   * @param raw       原始字符串
   * @param publicKey Base64 公钥字符串
   * @return Base64 编码的密文
   */
  public static String encrypt(final String raw, final String publicKey) {
    // 获取加密 `Cipher` 实例
    final Cipher encryptCipher = getEncryptCipher(publicKey);

    // 加密
    final byte[] messageBytes = raw.getBytes(StandardCharsets.UTF_8);
    final byte[] bytes;

    try {
      bytes = encryptCipher.doFinal(messageBytes);
    } catch (IllegalBlockSizeException | BadPaddingException e) {
      throw new RuntimeException(e);
    }

    // 使用 Base64 编码显示加密结果
    return Base64.getEncoder().encodeToString(bytes);
  }

  /**
   * 使用私钥解密字符串。
   *
   * @param encrypted  密文
   * @param privateKey Base64 私钥字符串
   * @return 原始字符串
   */
  public static String decrypt(final String encrypted, final String privateKey) {
    // 获取解密 `Cipher` 实例
    final Cipher decryptCipher = getDecryptCipher(privateKey);

    // 使用 Base64 解码密文
    final byte[] encryptedBytes = Base64.getDecoder().decode(encrypted);

    // 解密
    final byte[] bytes;

    try {
      bytes = decryptCipher.doFinal(encryptedBytes);
    } catch (IllegalBlockSizeException | BadPaddingException e) {
      throw new RuntimeException(e);
    }

    // 返回解密结果字符串
    return new String(bytes, StandardCharsets.UTF_8);
  }

  /**
   * 从 Base64 公钥字符串中获取公钥。
   *
   * @param base64PublicKey Base64 公钥字符串
   * @return 公钥
   */
  public static PublicKey getPublicKey(final String base64PublicKey) {
    final byte[] keyBytes = Base64.getDecoder().decode(base64PublicKey);
    final X509EncodedKeySpec keySpec = new X509EncodedKeySpec(keyBytes);

    final KeyFactory keyFactory = getKeyFactory();

    try {
      return keyFactory.generatePublic(keySpec);
    } catch (InvalidKeySpecException e) {
      throw new RuntimeException("无效的公钥: %s".formatted(base64PublicKey), e);
    }
  }

  /**
   * 从 Base64 私钥字符串中获取私钥。
   *
   * @param base64PrivateKey Base64 私钥字符串
   * @return 私钥
   */
  public static PrivateKey getPrivateKey(final String base64PrivateKey) {
    final byte[] keyBytes = Base64.getDecoder().decode(base64PrivateKey);
    final PKCS8EncodedKeySpec keySpec = new PKCS8EncodedKeySpec(keyBytes);

    final KeyFactory keyFactory = getKeyFactory();

    try {
      return keyFactory.generatePrivate(keySpec);
    } catch (InvalidKeySpecException e) {
      throw new RuntimeException("无效的私钥: %s".formatted(base64PrivateKey), e);
    }
  }

  private static KeyPairGenerator getKeyPairGenerator() {
    final KeyPairGenerator rsa;

    try {
      rsa = KeyPairGenerator.getInstance(RSA_CRYPTO_ALGORITHM);
    } catch (NoSuchAlgorithmException e) {
      throw new RuntimeException(
        "不支持的加密算法 [%s]".formatted(RSA_CRYPTO_ALGORITHM),
        e
      );
    }

    return rsa;
  }

  private static Cipher getEncryptCipher(final String publicKey) {
    final Cipher cipher = getCipher();

    try {
      cipher.init(Cipher.ENCRYPT_MODE, getPublicKey(publicKey));
    } catch (InvalidKeyException e) {
      throw new RuntimeException("无效的公钥", e);
    }

    return cipher;
  }

  private static Cipher getDecryptCipher(final String privateKey) {
    final Cipher cipher = getCipher();

    try {
      cipher.init(Cipher.DECRYPT_MODE, getPrivateKey(privateKey));
    } catch (InvalidKeyException e) {
      throw new RuntimeException("无效的私钥", e);
    }

    return cipher;
  }

  private static Cipher getCipher() {
    final Cipher cipher;

    try {
      cipher = Cipher.getInstance(RSA_CRYPTO_ALGORITHM);
    } catch (NoSuchAlgorithmException | NoSuchPaddingException e) {
      throw new RuntimeException(
        "不支持加密算法 [%s]".formatted(RSA_CRYPTO_ALGORITHM),
        e
      );
    }

    return cipher;
  }

  private static KeyFactory getKeyFactory() {
    final KeyFactory keyFactory;

    try {
      keyFactory = KeyFactory.getInstance(RSA_CRYPTO_ALGORITHM);
    } catch (NoSuchAlgorithmException e) {
      throw new RuntimeException(
        "不支持加密算法 [%s]".formatted(RSA_CRYPTO_ALGORITHM),
        e
      );
    }

    return keyFactory;
  }

  /**
   * RSA 密钥对。
   *
   * @param publicKey  Base64 公钥字符串
   * @param privateKey Base64 私钥字符串
   */
  public record RsaKeyPair(String publicKey, String privateKey) {}
}
