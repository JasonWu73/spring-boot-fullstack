package net.wuxianjie.web.shared.auth;

public interface AuthService {

  TokenResponse login(LoginParams params);

  void logout();

  TokenResponse refresh(String refreshToken);
}
