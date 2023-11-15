package net.wuxianjie.web.auth;

public interface TokenAuth {

  AuthData authenticate(String accessToken);
}
