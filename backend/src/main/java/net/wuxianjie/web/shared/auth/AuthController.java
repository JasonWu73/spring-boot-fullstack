package net.wuxianjie.web.shared.auth;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import net.wuxianjie.web.shared.operationlog.Operation;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

  private final AuthService authService;

  /**
   * 登录。
   */
  @Operation("登录")
  @PostMapping("/login")
  public AuthResponse login(@Valid @RequestBody final LoginParam param) {
    return authService.login(param);
  }

  /**
   * 退出。
   */
  @DeleteMapping("/logout")
  public ResponseEntity<Void> logout() {
    authService.logout();

    return ResponseEntity.noContent().build();
  }

  /**
   * 刷新令牌。
   */
  @PostMapping("/refresh/{refreshToken}")
  public AuthResponse refresh(@PathVariable final String refreshToken) {
    return authService.refresh(refreshToken);
  }
}
