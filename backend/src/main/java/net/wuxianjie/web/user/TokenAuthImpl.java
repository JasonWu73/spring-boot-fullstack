package net.wuxianjie.web.user;

import net.wuxianjie.web.shared.auth.CachedAuth;
import net.wuxianjie.web.shared.auth.TokenAuth;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TokenAuthImpl implements TokenAuth {

  @Override
  public CachedAuth authenticate(final String accessToken) {
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
