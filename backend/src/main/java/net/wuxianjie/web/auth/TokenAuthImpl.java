package net.wuxianjie.web.auth;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TokenAuthImpl implements TokenAuth {

  @Override
  public AuthData authenticate(String accessToken) {
    return new AuthData(
      100,
      "admin",
      "hashed_password",
      "管理员",
      AccountStatus.DISABLED,
      List.of("user", "role"),
      "740e6dba8e924c568aabeab685fa6108" // UUID.randomUUID().toString().replace("-", "")
    );
  }
}
