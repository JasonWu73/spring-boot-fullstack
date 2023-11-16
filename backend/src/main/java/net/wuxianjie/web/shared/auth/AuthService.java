package net.wuxianjie.web.shared.auth;

public interface AuthService {

  TokenResponse login(LoginParams params);

  TokenResponse refresh(String refreshToken);
}
