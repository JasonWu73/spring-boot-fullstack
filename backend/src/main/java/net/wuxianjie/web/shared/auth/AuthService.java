package net.wuxianjie.web.shared.auth;

public interface AuthService {

  Token login(LoginParams params);

  void logout();

  Token refresh(String refreshToken);
}
