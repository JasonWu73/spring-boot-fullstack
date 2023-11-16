package net.wuxianjie.web.auth;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TokenAuthImpl implements TokenAuth {

  @Override
  public CachedAuth authenticate(String accessToken) {
    return new CachedAuth(
      100,
      "admin",
      "hashed_password",
      List.of("admin"),
      "740e6dba8e924c568aabeab685fa6108", // UUID.randomUUID().toString().replace("-", "")
      "740e6dba8e924c568aabeab685fa6108"
    );
  }
}
