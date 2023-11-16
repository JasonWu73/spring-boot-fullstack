package net.wuxianjie.web.shared.util;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;

class RsaUtilsTest {

  private static final String PUBLIC_KEY = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCmWWFyJSaS/SMYr7hmCSXcwAvPF+aGPbbQFOt3rJXjDVKL2GhumWXH2y+dC5/DoaCtDz3dFTyzuoYyiuTHzbpsQ7ari8LoRunOJ81Hx0szpdKbOYJ5WnUr3mr7qEIwY5Verh1dgknNxuzeeTNlmAeLQj067+B+7m9+xp2WU+VSawIDAQAB";
  private static final String PRIVATE_KEY = "MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBAKZZYXIlJpL9IxivuGYJJdzAC88X5oY9ttAU63esleMNUovYaG6ZZcfbL50Ln8OhoK0PPd0VPLO6hjKK5MfNumxDtquLwuhG6c4nzUfHSzOl0ps5gnladSveavuoQjBjlV6uHV2CSc3G7N55M2WYB4tCPTrv4H7ub37GnZZT5VJrAgMBAAECgYAOZZ3xaxWzkwT+lfa3ngMQ3+4ltkPVSnIQAD+A1AcE55pFUC15pP0SFv4/8UmafNqTH8aS48ulIneK2EqEoGGJ6QUUQnmx8AhYGmANc9J7l4xZymUj7sUX7ipKCjfqomPbIZcxp2eRua3gunCXPo7HLFkZH8rmYOjdovw3IZzAQQJBAPIYpYZncyNZgWQa9pXRdZOghssGXnPrkUfiqdrAkZw6aGd8fspcm+4ahsULsWXVCvEmD6tyqtaB1S7xl18Laz0CQQCv5xU0v/9Z+4g39GauxTuh56N5AQ4WJxcCwP+iz8D5+Tkwf4FDmy4uDXMhgBcrEKmy7cKEKDlh+3LllG5DwC7HAkEAz7RrlvN8ahCpnVwwwPrS+FRaMSeGs8egfl8uQRrEEphd6KN8GFv5//9MLxRIH8j3OUvhV8PqZF1BrKPjrcybNQJAZzz49Ty6YdV+3VhT679WgG+zQhGccuP+XV9oqeXFHPFo3032T/eD4wOBzueesWfWMW3Z/DafdyJdDOFQ1fK1gQJAJAjujLut9M0W4AhMEOeIWmiG92zZd9v0sUx0S5ZiUus5cPPAiEpao+qbKXSb4WVAM8nsoe62Z+MvoB5nlBQcQw==";

  private static final String RAW = "你好 RSA";
  private static final String ENCRYPTED = "gF6FfLndu2PswhcBcL47jb1lLCgv01tsrvPVk0klL4rhFbmngBdMIh47U69v3bjGwaOpzgBuV9lmYE4xpmM1dvXsVfKsf2IlL/8LX3oEtKpPIn+gijbqTyG4n7abjmETXoJLEkXsbONIihEXFEPqgxsJGT0QOGBDd7XSO2j6q3c=";

  @Test
  void generateKeyPair() {
    final RsaUtils.RsaKeyPair rsaKeyPair = RsaUtils.generateKeyPair();

    Assertions.assertThat(rsaKeyPair.publicKey()).isNotBlank().isBase64();
    Assertions.assertThat(rsaKeyPair.privateKey()).isNotBlank().isBase64();

    System.out.println("公钥: " + rsaKeyPair.publicKey());
    System.out.println("私钥: " + rsaKeyPair.privateKey());
  }

  @Test
  void encrypt() {
    final String encrypted = RsaUtils.encrypt(RAW, PUBLIC_KEY);

    final String decrypted = RsaUtils.decrypt(encrypted, PRIVATE_KEY);

    Assertions.assertThat(decrypted).isEqualTo(RAW);

    // System.out.printf("原文: %s%n密文: %s%n", RAW, encrypted);
  }

  @Test
  void decrypt() {
    final String decrypted = RsaUtils.decrypt(ENCRYPTED, PRIVATE_KEY);

    Assertions.assertThat(decrypted).isEqualTo(RAW);
  }
}
