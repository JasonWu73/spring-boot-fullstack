package net.wuxianjie.backend.shared.util;

import lombok.extern.slf4j.Slf4j;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

@Slf4j
@Disabled
class RsaUtilsTest {

  private static final String PUBLIC_KEY =
    "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArbGWjwR4QAjBiJwMi5QNe+X8oPEFBfX3z5K6dSv9tU2kF9SVkf8uGGJwXeihQQ0o9aUk42zO58VL3MqDOaWHU6wm52pN9ZBbH0XJefqxtgyXrYAm279MU6EY4sywkUT9KOOgk/qDHB93IoEDL1fosYc7TRsAONuMGiyTJojn1FCPtJbbj7J56yCaFhUpuDunBFETQ32usRaK4KCWx9w0HZ6WmbX8QdcJkVjJ2FCLuGkvbKmUQ5h/GXXnNgbxIn3z2lX7snGRMhIFvW0Qjkn8YmOq6HUj7TU0jKm9VhZirVQXh8trvi2ivY7s6yJoF8N72Ekn94WSpSRVeC0XpXf2LQIDAQAB";
  private static final String PRIVATE_KEY =
    "MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCtsZaPBHhACMGInAyLlA175fyg8QUF9ffPkrp1K/21TaQX1JWR/y4YYnBd6KFBDSj1pSTjbM7nxUvcyoM5pYdTrCbnak31kFsfRcl5+rG2DJetgCbbv0xToRjizLCRRP0o46CT+oMcH3cigQMvV+ixhztNGwA424waLJMmiOfUUI+0ltuPsnnrIJoWFSm4O6cEURNDfa6xForgoJbH3DQdnpaZtfxB1wmRWMnYUIu4aS9sqZRDmH8Zdec2BvEiffPaVfuycZEyEgW9bRCOSfxiY6rodSPtNTSMqb1WFmKtVBeHy2u+LaK9juzrImgXw3vYSSf3hZKlJFV4LReld/YtAgMBAAECggEARUFg6cd7dvTGzgSCkAjJU5SBJV7UhOrtEyvLArs2ntrFSecueBcKNxjQ+vCtkzV/FmrxiWiyGwG03OU2a37PtZIXtP/S883KN27pBaTqxM7Cj6BgXhApi9LZDF1XLaUXV/1i4n3pVwZIx04vieoAUwC7qWPRs9n+Q9VwGtZNsX6Baxu1Le5qfg/zbRofODpLQa0XuLA8M5+ieBzwNrjrHvYQQ0GGaNxqvyoZaxx9SCBtvGwE8T0vHF+lXTYaotbazrtGT3OneWza4Qa0HRjgZKBHKyOzsZWpjiw8ISQxzpG0hD6o7+YeYpC3zt7ZLwuZOZOG0QPvzBioPvhDJP75tQKBgQDJtFlkeRanpF054rKLm32Udm4B1E43U/fjwgAM+X3jUN3PaXmpNKUFQTtB+symi20eTpw6HDumRNCi5q644wyjdF2nVDHi6lcAl63NLT0x7+431IHlrqd4UGnzh+T8pN3yiNvqlUrDYpXoKtSeRCJfbUCvLjwi8LHwzbbN7nOLRwKBgQDccv0bc+DL5N6JmfjMn7/851QKc4ugMrsJwZe/VE8Sxwop5dTBiTb1UXMAhUG+UMt03qtXav0b+3F5SFhZO/M+GhpVdVIPbyjPTjE/XUc+VBUIED+NT7vWbv+lTwcEpTwMdxTqrO1GHfURGWO0CiaPbkS6YVrn5sI71iQXe/YE6wKBgQDIBV64chPzPt1sL9Da/OD1vtOsYLsHxu8GHzYpp6gdKe4sZu5My3Xx1hRLg8g6R/13loD6Z1EHuyoiwRv3IMFBvn25F5c47SZF4iRqWThcMxBKsSP3ftF4UFYhOFvt5hhrESj0YgP36eW6i+6429wyQYdpsTHVfFcY8wcbBCH0tQKBgCp6LbMgfOxMyWSSOpKTJZdBq7vnz7uqiseyed7wC9x+ZcL0+i3glqpma1ZqVuSpBMscLL/HacX+iTrpabyoBJKuzOwykwFOVfq8AllHS/cClJrdJqG//12uPaxIsf1/KTbtqyYc9AtSsmn9Dm0el5eDk9Kl97I/kKWe+Y1c4WbJAoGBAKzMJSbxfDXpnwb48RWUAQK/o5b7Jyz2ZBmL9+UsoUG9hoqC9NngBOGR5NGE+xGJRfwBPyXZim4fL9hr7Xurw0cd39d86DikL+3l804thbSiegAQtHhn6Ko/UMjVTkPmjsdvY5OaWO2SQGhhzbfhaMqgiaUBOsQP4DAoJd5faQlu";

  private static final String RAW = "你好，RSA";
  private static final String ENCRYPTED =
    "oLzZij32svx27Z0FtV9C7+FElri2XB0OMoxr8VScWqnZx03cAkE8IqKn6LCYjOwJ4C9zGpgmKHFaVWmeCOdS/zcPWbcARHTrduRm+hy8RBLpZb0tmEE0TqQasMt8UkjcOCFi9klqQcQc5ebG6EA5cpTaaunSehFLMS2ztWQIoqxjWDJPjrnMFNhI3U8JmzwqgczP6K5ZSZzkRkTgEvMosvkh8Mi717qgRk4ntypdHsASBRa5gPqvPkrCfGOZQJxevXckHgYBD3NxwjF1KyHlw6m+rC8PDNySDU1EhyrUSr9Ggrqcj7K4+s2huKoE23WJa4f2ScxIwkFLyiSkyyKuSg==";

  @Test
  void generateKeyPair() {
    final RsaUtils.RsaKeyPair keyPair = RsaUtils.generateKeyPair();

    Assertions.assertThat(keyPair.publicKey()).isNotBlank().isBase64();
    Assertions.assertThat(keyPair.privateKey()).isNotBlank().isBase64();

    log.info("公钥: {}\n私钥: {}", keyPair.publicKey(), keyPair.privateKey());
  }

  @Test
  void encrypt() {
    final String encrypted = RsaUtils.encrypt(RAW, PUBLIC_KEY);
    final String decrypted = RsaUtils.decrypt(encrypted, PRIVATE_KEY);

    Assertions.assertThat(decrypted).isEqualTo(RAW);

    log.info("原文: {}\n密文: {}", RAW, encrypted);
  }

  @Test
  void decrypt() {
    final String decrypted = RsaUtils.decrypt(ENCRYPTED, PRIVATE_KEY);

    Assertions.assertThat(decrypted).isEqualTo(RAW);
  }
}
