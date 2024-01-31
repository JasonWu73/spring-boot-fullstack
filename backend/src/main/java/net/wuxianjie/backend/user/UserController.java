package net.wuxianjie.backend.user;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import net.wuxianjie.backend.shared.auth.annotation.Admin;
import net.wuxianjie.backend.shared.auth.annotation.Root;
import net.wuxianjie.backend.shared.pagination.PaginationParam;
import net.wuxianjie.backend.shared.pagination.PaginationResult;
import net.wuxianjie.backend.user.dto.AddUserParam;
import net.wuxianjie.backend.user.dto.GetUserParam;
import net.wuxianjie.backend.user.dto.ResetPasswordParam;
import net.wuxianjie.backend.user.dto.UpdateMeParam;
import net.wuxianjie.backend.user.dto.UpdateUserParam;
import net.wuxianjie.backend.user.dto.UpdateUserStatusParam;
import net.wuxianjie.backend.user.dto.UserInfo;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 用户 API。
 */
@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
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
   * @param param 最新的用户数据
   * @return 204 No Content
   */
  @PutMapping("/me")
  public ResponseEntity<Void> updateMe(
    @RequestBody @Valid final UpdateMeParam param
  ) {
    userService.updateMe(param);
    return ResponseEntity.noContent().build();
  }

  /**
   * 获取用户分页列表。
   *
   * @param paginationParam 分页参数
   * @param userParam 查询参数
   * @return 用户分页列表
   */
  @Admin
  @GetMapping
  public PaginationResult<UserInfo> getUsers(
    @Valid final PaginationParam paginationParam,
    @Valid final GetUserParam userParam
  ) {
    return userService.getUsers(paginationParam, userParam);
  }

  /**
   * 获取用户详情。
   *
   * @param userId 用户 ID
   * @return 用户详情
   */
  @Admin
  @GetMapping("/{userId}")
  public UserInfo getUserDetail(@PathVariable final long userId) {
    return userService.getUserDetail(userId);
  }

  /**
   * 新增用户。
   *
   * @param param 新增用户参数
   * @return 204 No Content
   */
  @Admin
  @PostMapping
  public ResponseEntity<Void> addUser(
    @RequestBody @Valid final AddUserParam param
  ) {
    userService.addUser(param);
    return ResponseEntity.noContent().build();
  }

  /**
   * 更新用户。
   *
   * @param userId 需要更新的用户 ID
   * @param param 更新用户参数
   * @return 204 No Content
   */
  @Admin
  @PutMapping("/{userId}")
  public ResponseEntity<Void> updateUser(
    @PathVariable final long userId,
    @RequestBody @Valid final UpdateUserParam param
  ) {
    userService.updateUser(userId, param);
    return ResponseEntity.noContent().build();
  }

  /**
   * 重置用户密码。
   *
   * @param userId 需要重置密码的用户 ID
   * @param param 重置密码参数
   * @return 204 No Content
   */
  @Root
  @PutMapping("/{userId}/password")
  public ResponseEntity<Void> resetPassword(
    @PathVariable final long userId,
    @RequestBody @Valid final ResetPasswordParam param
  ) {
    userService.resetPassword(userId, param);
    return ResponseEntity.noContent().build();
  }

  /**
   * 禁用/启用用户。
   *
   * @param userId 需要更新的用户 ID
   * @param param 更新用户状态参数
   * @return 204 No Content
   */
  @Admin
  @PutMapping("/{userId}/status")
  public ResponseEntity<Void> updateUserStatus(
    @PathVariable final long userId,
    @RequestBody @Valid final UpdateUserStatusParam param
  ) {
    userService.updateUserStatus(userId, param);
    return ResponseEntity.noContent().build();
  }

  /**
   * 删除用户。
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
