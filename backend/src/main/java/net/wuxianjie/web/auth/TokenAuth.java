package net.wuxianjie.web.auth;

public interface TokenAuth {

  CachedAuth authenticate(String accessToken);
}
