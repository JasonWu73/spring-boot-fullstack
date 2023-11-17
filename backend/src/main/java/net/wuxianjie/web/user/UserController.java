package net.wuxianjie.web.user;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import net.wuxianjie.web.shared.SuccessOrNot;
import net.wuxianjie.web.shared.auth.Admin;
import net.wuxianjie.web.shared.auth.Root;
import net.wuxianjie.web.shared.pagination.PaginationParams;
import net.wuxianjie.web.shared.pagination.PaginationResult;
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
  public SuccessOrNot updateMe(
    @Valid @RequestBody final UpdateMeParams params) {
    userService.updateMe(params);
    return new SuccessOrNot(true);
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
  public SuccessOrNot addUser(@Valid @RequestBody final AddUserParams params) {
    userService.addUser(params);
    return new SuccessOrNot(true);
  }

  /**
   * 更新用户。
   */
  @Admin
  @PutMapping("/{userId}")
  public SuccessOrNot updateUser(
    @PathVariable final long userId,
    @Valid @RequestBody final UpdateUserParams params
  ) {
    userService.updateUser(userId, params);
    return new SuccessOrNot(true);
  }

  /**
   * 重置用户密码。
   */
  @Root
  @PutMapping("/{userId}/password")
  public SuccessOrNot resetPassword(
    @PathVariable final long userId,
    @Valid @RequestBody final ResetPasswordParams params
  ) {
    userService.resetPassword(userId, params);
    return new SuccessOrNot(true);
  }

  /**
   * 禁用/启用用户。
   */
  @Admin
  @PutMapping("/{userId}/status")
  public SuccessOrNot updateUserStatus(
    @PathVariable final long userId,
    @Valid @RequestBody final UpdateUserStatusParams params
  ) {
    userService.updateUserStatus(userId, params);
    return new SuccessOrNot(true);
  }

  /**
   * 删除用户。
   */
  @Root
  @DeleteMapping("/{userId}")
  public SuccessOrNot deleteUser(@PathVariable final long userId) {
    userService.deleteUser(userId);
    return new SuccessOrNot(true);
  }
}
