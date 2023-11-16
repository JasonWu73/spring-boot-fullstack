package net.wuxianjie.web.user;

import net.wuxianjie.web.auth.AuthService;
import net.wuxianjie.web.auth.LoginParams;
import net.wuxianjie.web.auth.TokenResponse;
import net.wuxianjie.web.shared.exception.ApiException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService implements AuthService {

  @Override
  public TokenResponse login(LoginParams params) {
    if (params.getUsername().equals("admin")) {
      return new TokenResponse(
        "admin-token",
        "admin-refresh-token",
        1800,
        "管理员",
        List.of("admin")
      );
    }

    if (params.getUsername().equals("user")) {
      return new TokenResponse(
        "user-token",
        "user-refresh-token",
        1800,
        "用户",
        List.of("user")
      );
    }

    if (params.getUsername().equals("guest")) {
      return new TokenResponse(
        "user-token",
        "user-refresh-token",
        1800,
        "来宾",
        List.of("user")
      );
    }

    throw new ApiException(HttpStatus.NOT_FOUND, "用户名或密码错误");
  }

  @Override
  public TokenResponse refresh(String refreshToken) {
    return null;
  }
}
