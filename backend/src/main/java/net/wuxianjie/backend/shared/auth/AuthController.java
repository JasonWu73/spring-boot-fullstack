package net.wuxianjie.backend.shared.auth;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import net.wuxianjie.backend.shared.auth.dto.LoginParam;
import net.wuxianjie.backend.shared.auth.dto.LoginResult;
import net.wuxianjie.backend.shared.oplog.Operation;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 身份验证 API。
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
  public LoginResult login(@RequestBody @Valid final LoginParam param) {
    return authService.login(param);
  }

  /**
   * 刷新身份验证信息。
   *
   * @param refreshToken 刷新令牌，用于刷新身份验证信息的令牌
   * @return 身份验证结果
   */
  @PostMapping("/refresh/{refreshToken}")
  public LoginResult refresh(@PathVariable final String refreshToken) {
    return authService.refresh(refreshToken);
  }

  /**
   * 退出登录。
   *
   * @return 204 No Content
   */
  @DeleteMapping("/logout")
  public ResponseEntity<Void> logout() {
    final String username = AuthUtils.getCurrentUser().orElseThrow().username();
    authService.logout(username);
    return ResponseEntity.noContent().build();
  }
}
