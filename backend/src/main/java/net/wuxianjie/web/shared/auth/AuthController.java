package net.wuxianjie.web.shared.auth;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import net.wuxianjie.web.shared.auth.dto.AuthResult;
import net.wuxianjie.web.shared.auth.dto.LoginParam;
import net.wuxianjie.web.shared.operationlog.Operation;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * 身份验证相关接口。
 */
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

  private final AuthService authService;

  /**
   * 登录。
   *
   * @param param 登录参数
   * @return 身份验证结果
   */
  @Operation("登录")
  @PostMapping("/login")
  public AuthResult login(@Valid @RequestBody final LoginParam param) {
    return authService.login(param);
  }

  /**
   * 退出登录。
   *
   * @return 204 No Content
   */
  @DeleteMapping("/logout")
  public ResponseEntity<Void> logout() {
    authService.logout();
    return ResponseEntity.noContent().build();
  }

  /**
   * 刷新身份验证信息。
   *
   * @param refreshToken 用于刷新的刷新令牌
   * @return 身份验证结果
   */
  @PostMapping("/refresh/{refreshToken}")
  public AuthResult refresh(@PathVariable final String refreshToken) {
    return authService.refresh(refreshToken);
  }
}
