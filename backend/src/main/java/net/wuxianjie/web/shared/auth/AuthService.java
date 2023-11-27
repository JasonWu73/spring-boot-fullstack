package net.wuxianjie.web.shared.auth;

public interface AuthService {

  AuthResponse login(LoginParams params);

  void logout();

  AuthResponse refresh(String refreshToken);
}
