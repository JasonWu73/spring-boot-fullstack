package net.wuxianjie.backend.shared.util;

import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.KeyFactory;
import java.security.KeyPairGenerator;
import java.security.NoSuchAlgorithmException;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;
import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;

/**
 * RSA 加密工具类。
 */
public class RsaUtils {

  /**
   * 虽然 1024 位的密钥长度被认为是相对安全的，但 2048 或 4096 位更加安全。
   */
  private static final int RSA_KEY_LENGTH = 2048;

  private static final String RSA_CRYPTO_ALGORITHM = "RSA";

  /**
   * 生成新的 RSA 2048 位密钥对，密钥对使用 Base64 编码。
   *
   * @return Base64 编码的密钥对
   */
  public static KeyPair generateKeyPair() {
    final KeyPairGenerator rsa = getKeyPairGenerator();
    rsa.initialize(RSA_KEY_LENGTH);
    final java.security.KeyPair keyPair = rsa.generateKeyPair();

    return new KeyPair(
      Base64.getEncoder().encodeToString(keyPair.getPublic().getEncoded()),
      Base64.getEncoder().encodeToString(keyPair.getPrivate().getEncoded())
    );
  }

  /**
   * 使用公钥加密字符串。
   *
   * @param raw 需要加密的原始字符串
   * @param publicKey Base64 公钥字符串
   * @return Base64 编码的密文
   */
  public static String encrypt(final String raw, final String publicKey) {
    final Cipher encryptCipher = getEncryptCipher(publicKey);
    final byte[] messageBytes = raw.getBytes();
    final byte[] bytes;
    try {
      bytes = encryptCipher.doFinal(messageBytes);
    } catch (IllegalBlockSizeException | BadPaddingException e) {
      throw new RuntimeException("使用公钥加密失败", e);
    }

    return Base64.getEncoder().encodeToString(bytes);
  }

  /**
   * 使用私钥解密字符串。
   *
   * @param encrypted 需要解密的密文
   * @param privateKey Base64 私钥字符串
   * @return 原始字符串
   */
  public static String decrypt(final String encrypted, final String privateKey) {
    final Cipher decryptCipher = getDecryptCipher(privateKey);
    final byte[] encryptedBytes = Base64.getDecoder().decode(encrypted);
    final byte[] bytes;
    try {
      bytes = decryptCipher.doFinal(encryptedBytes);
    } catch (IllegalBlockSizeException | BadPaddingException e) {
      throw new RuntimeException("使用私钥解密失败", e);
    }

    return new String(bytes, StandardCharsets.UTF_8);
  }

  /**
   * 从 Base64 公钥字符串中解析出公钥。
   *
   * @param publicKey Base64 公钥字符串
   * @return 公钥
   */
  public static PublicKey getPublicKey(final String publicKey) {
    final byte[] keyBytes = Base64.getDecoder().decode(publicKey);

    final X509EncodedKeySpec keySpec = new X509EncodedKeySpec(keyBytes);
    final KeyFactory keyFactory = getKeyFactory();
    try {
      return keyFactory.generatePublic(keySpec);
    } catch (InvalidKeySpecException e) {
      throw new RuntimeException("无效的公钥: %s".formatted(publicKey), e);
    }
  }

  /**
   * 从 Base64 私钥字符串中解析出私钥。
   *
   * @param privateKey Base64 私钥字符串
   * @return 私钥
   */
  public static PrivateKey getPrivateKey(final String privateKey) {
    final byte[] keyBytes = Base64.getDecoder().decode(privateKey);

    final PKCS8EncodedKeySpec keySpec = new PKCS8EncodedKeySpec(keyBytes);
    final KeyFactory keyFactory = getKeyFactory();
    try {
      return keyFactory.generatePrivate(keySpec);
    } catch (InvalidKeySpecException e) {
      throw new RuntimeException("无效的私钥: %s".formatted(privateKey), e);
    }
  }

  private static KeyPairGenerator getKeyPairGenerator() {
    final KeyPairGenerator rsa;
    try {
      rsa = KeyPairGenerator.getInstance(RSA_CRYPTO_ALGORITHM);
    } catch (NoSuchAlgorithmException e) {
      throw new RuntimeException("不支持的加密算法: %s".formatted(RSA_CRYPTO_ALGORITHM), e);
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
      throw new RuntimeException("不支持的加密算法: %s".formatted(RSA_CRYPTO_ALGORITHM), e);
    }
    return cipher;
  }

  private static KeyFactory getKeyFactory() {
    final KeyFactory keyFactory;
    try {
      keyFactory = KeyFactory.getInstance(RSA_CRYPTO_ALGORITHM);
    } catch (NoSuchAlgorithmException e) {
      throw new RuntimeException("不支持的加密算法: %s".formatted(RSA_CRYPTO_ALGORITHM), e);
    }
    return keyFactory;
  }

  /**
   * RSA 密钥对。
   *
   * @param publicKey Base64 公钥字符串
   * @param privateKey Base64 私钥字符串
   */
  public record KeyPair(String publicKey, String privateKey) {}
}
