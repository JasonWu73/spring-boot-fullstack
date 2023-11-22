package net.wuxianjie.web.user;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import net.wuxianjie.web.shared.auth.Admin;
import net.wuxianjie.web.shared.auth.Root;
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
   * 更新当前用户信息。
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
  public UserInfo getUserInfo(@PathVariable final long userId) {
    return userService.getUserInfo(userId);
  }

  /**
   * 新增用户。
   */
  @Admin
  @PostMapping
  public ResponseEntity<Void> addUser(@Valid @RequestBody final AddUserParams params) {
    userService.addUser(params);

    return ResponseEntity.noContent().build();
  }

  /**
   * 更新用户。
   */
  @Admin
  @PutMapping("/{userId}")
  public ResponseEntity<Void> updateUser(
    @PathVariable final long userId,
    @Valid @RequestBody final UpdateUserParams params
  ) {
    userService.updateUser(userId, params);

    return ResponseEntity.noContent().build();
  }

  /**
   * 重置用户密码。
   */
  @Root
  @PutMapping("/{userId}/password")
  public ResponseEntity<Void> resetPassword(
    @PathVariable final long userId,
    @Valid @RequestBody final ResetPasswordParams params
  ) {
    userService.resetPassword(userId, params);

    return ResponseEntity.noContent().build();
  }

  /**
   * 禁用/启用用户。
   */
  @Admin
  @PutMapping("/{userId}/status")
  public ResponseEntity<Void> updateUserStatus(
    @PathVariable final long userId,
    @Valid @RequestBody final UpdateUserStatusParams params
  ) {
    userService.updateUserStatus(userId, params);

    return ResponseEntity.noContent().build();
  }

  /**
   * 删除用户。
   */
  @Root
  @DeleteMapping("/{userId}")
  public ResponseEntity<Void> deleteUser(@PathVariable final long userId) {
    userService.deleteUser(userId);

    return ResponseEntity.noContent().build();
  }
}
