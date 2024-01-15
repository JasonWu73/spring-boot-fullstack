package net.wuxianjie.backend.user;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import net.wuxianjie.backend.shared.auth.annotation.Admin;
import net.wuxianjie.backend.shared.auth.annotation.Root;
import net.wuxianjie.backend.shared.page.PageParam;
import net.wuxianjie.backend.shared.page.PageResult;
import net.wuxianjie.backend.user.dto.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * 用户 API。
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/users")
public class UserController {

  private final UserService userService;

  /**
   * 获取当前用户数据。
   * <p>
   * 主要用于用户查看自己的个人资料。
   */
  @GetMapping("/me")
  public UserInfo getMe() {
    return userService.getMe();
  }

  /**
   * 更新当前用户信息。
   * <p>
   * 主要用于用户更新自己的个人资料。
   *
   * @param param 更新当前用户信息参数
   * @return 204 No Content
   */
  @PutMapping("/me")
  public ResponseEntity<Void> updateMe(
    @Valid @RequestBody final UpdateMeParam param
  ) {
    userService.updateMe(param);
    return ResponseEntity.noContent().build();
  }

  /**
   * 获取用户分页列表。
   * <p>
   * 权限要求：管理员。
   *
   * @param pageParam 分页参数
   * @param userParam 用户查询参数
   * @return 用户分页列表
   */
  @Admin
  @GetMapping
  public PageResult<UserInfo> getUsers(
    @Valid final PageParam pageParam,
    @Valid final GetUserParam userParam
  ) {
    return userService.getUsers(pageParam, userParam);
  }

  /**
   * 获取用户详情。
   * <p>
   * 权限要求：管理员。
   *
   * @param userId 用户 ID
   * @return 用户详情
   */
  @Admin
  @GetMapping("/{userId}")
  public UserInfo getUserInfo(@PathVariable final long userId) {
    return userService.getUserInfo(userId);
  }

  /**
   * 新增用户。
   * <p>
   * 权限要求：管理员。
   *
   * @param param 新增用户参数
   * @return 204 No Content
   */
  @Admin
  @PostMapping
  public ResponseEntity<Void> addUser(
    @Valid @RequestBody final AddUserParam param
  ) {
    userService.addUser(param);
    return ResponseEntity.noContent().build();
  }

  /**
   * 更新用户。
   * <p>
   * 权限要求：管理员。
   *
   * @param userId 需要更新数据的用户 ID
   * @param param 更新用户参数
   * @return 204 No Content
   */
  @Admin
  @PutMapping("/{userId}")
  public ResponseEntity<Void> updateUser(
    @PathVariable final long userId,
    @Valid @RequestBody final UpdateUserParam param
  ) {
    userService.updateUser(userId, param);
    return ResponseEntity.noContent().build();
  }

  /**
   * 重置用户密码。
   * <p>
   * 权限要求：超级管理员。
   *
   * @param userId 需要重置密码的用户 ID
   * @param param 重置密码参数
   * @return 204 No Content
   */
  @Root
  @PutMapping("/{userId}/password")
  public ResponseEntity<Void> resetPassword(
    @PathVariable final long userId,
    @Valid @RequestBody final ResetPasswordParam param
  ) {
    userService.resetPassword(userId, param);
    return ResponseEntity.noContent().build();
  }

  /**
   * 禁用/启用用户。
   * <p>
   * 权限要求：管理员。
   *
   * @param userId 需要更新数据的用户 ID
   * @param param 更新用户状态参数
   * @return 204 No Content
   */
  @Admin
  @PutMapping("/{userId}/status")
  public ResponseEntity<Void> updateUserStatus(
    @PathVariable final long userId,
    @Valid @RequestBody final UpdateUserStatusParam param
  ) {
    userService.updateUserStatus(userId, param);
    return ResponseEntity.noContent().build();
  }

  /**
   * 删除用户。
   * <p>
   * 权限要求：超级管理员。
   *
   * @param userId 需要删除的用户 ID
   * @return 204 No Content
   */
  @Root
  @DeleteMapping("/{userId}")
  public ResponseEntity<Void> deleteUser(@PathVariable final long userId) {
    userService.deleteUser(userId);
    return ResponseEntity.noContent().build();
  }
}
