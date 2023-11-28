package net.wuxianjie.web.shared.auth;

public interface AuthService {

  AuthResponse login(LoginParam param);

  void logout();

  AuthResponse refresh(String refreshToken);
}
