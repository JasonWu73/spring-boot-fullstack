package net.wuxianjie.web.auth;

public interface AuthService {

  TokenResponse login(LoginParams params);

  TokenResponse refresh(String refreshToken);
}
