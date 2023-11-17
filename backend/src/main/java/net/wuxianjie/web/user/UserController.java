package net.wuxianjie.web.user;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import net.wuxianjie.web.shared.auth.Admin;
import net.wuxianjie.web.shared.pagination.PaginationParams;
import net.wuxianjie.web.shared.pagination.PaginationResult;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/users")
public class UserController {

  private final UserService userService;

  /**
   * 获取当前用户数据。
   *
   * <p>主要用于用户查看自己的个人信息。
   */
  @GetMapping("/me")
  public UserInfo getMe() {
    return userService.getMe();
  }

  /**
   * 修改当前用户信息。
   */
  @PutMapping("/me")
  public ResponseEntity<Void> updateMe(
    @Valid @RequestBody final UpdateMeParams params) {
    userService.updateMe(params);
    return ResponseEntity.noContent().build();
  }

  /**
   * 获取用户分页列表。
   */
  @Admin
  @GetMapping
  public PaginationResult<UserInfo> getUsers(
    @Valid final PaginationParams paginationParams,
    @Valid final GetUserParams userParams
  ) {
    return userService.getUsers(paginationParams, userParams);
  }

  /**
   * 获取用户详情。
   */
  @Admin
  @GetMapping("/{userId}")
  public UserInfo getUserDetails(@PathVariable final long userId) {
    return userService.getUserDetails(userId);
  }
}
