package net.wuxianjie.web.shared.auth;

public interface TokenAuth {

  CachedAuth authenticate(String accessToken) throws Exception;
}
