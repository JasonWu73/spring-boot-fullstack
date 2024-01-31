package net.wuxianjie.backend.user;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import net.wuxianjie.backend.shared.auth.AuthService;
import net.wuxianjie.backend.shared.auth.AuthUtils;
import net.wuxianjie.backend.shared.auth.Authority;
import net.wuxianjie.backend.shared.auth.dto.AuthenticatedUser;
import net.wuxianjie.backend.shared.exception.ApiException;
import net.wuxianjie.backend.shared.pagination.PaginationParam;
import net.wuxianjie.backend.shared.pagination.PaginationResult;
import net.wuxianjie.backend.shared.util.RsaUtils;
import net.wuxianjie.backend.shared.util.StrUtils;
import net.wuxianjie.backend.user.dto.AddUserParam;
import net.wuxianjie.backend.user.dto.GetUserParam;
import net.wuxianjie.backend.user.dto.ResetPasswordParam;
import net.wuxianjie.backend.user.dto.UpdateMeParam;
import net.wuxianjie.backend.user.dto.UpdateUserParam;
import net.wuxianjie.backend.user.dto.UpdateUserStatusParam;
import net.wuxianjie.backend.user.dto.UserInfo;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

/**
 * 用户业务处理。
 */
@Service
@RequiredArgsConstructor
public class UserService {

  private final PasswordEncoder passwordEncoder;

  private final AuthService authService;
  private final UserMapper userMapper;

  /**
   * 获取当前用户数据。
   */
  public UserInfo getMe() {
    final long userId = AuthUtils.getCurrentUser().orElseThrow().userId();
    return Optional
      .ofNullable(userMapper.selectInfoById(userId))
      .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "用户不存在"));
  }

  /**
   * 更新当前用户信息。
   *
   * @param param 最新的用户数据
   */
  public void updateMe(final UpdateMeParam param) {
    // ----- 获取旧的用户数据 -----
    final AuthenticatedUser loggedIn = AuthUtils.getCurrentUser().orElseThrow();
    final User user = Optional
      .ofNullable(userMapper.selectById(loggedIn.userId()))
      .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "用户不存在"));

    // ----- 更新用户数据 -----
    user.setUpdatedAt(LocalDateTime.now());
    user.setNickname(param.getNickname());

    // 判断是否需要更新密码
    final boolean needsUpdatePassword = checkIfNeedsUpdatePassword(
      param.getOldPassword(),
      param.getNewPassword()
    );
    if (needsUpdatePassword) {
      final String oldPassword = decrypt(param.getOldPassword());
      final String newPassword = decrypt(param.getNewPassword());
      if (Objects.equals(newPassword, oldPassword)) {
        throw new ApiException(HttpStatus.BAD_REQUEST, "新旧密码不能相同");
      }

      if (!passwordEncoder.matches(oldPassword, user.getHashedPassword())) {
        throw new ApiException(HttpStatus.BAD_REQUEST, "旧密码错误");
      }

      user.setHashedPassword(passwordEncoder.encode(newPassword));
    }

    // 更新用户数据到数据库
    userMapper.updateById(user);

    // ----- 如果需要更新密码，则需要重新登录 -----
    if (needsUpdatePassword) {
      authService.logout(loggedIn.username());
    }
  }

  /**
   * 获取用户分页列表。
   *
   * @param paginationParam 分页参数
   * @param userParam 查询参数
   * @return 用户分页列表
   */
  public PaginationResult<UserInfo> getUsers(
    final PaginationParam paginationParam,
    final GetUserParam userParam
  ) {
    // 设置符合数据库 Like 条件的模糊查询参数
    setFuzzyQueryParams(userParam);

    // 根据查询条件获取分页列表
    final List<UserInfo> list = userMapper.selectByQueryLimit(paginationParam, userParam);

    // 根据查询条件获取总数
    final long total = userMapper.countByQuery(userParam);

    // 返回分页结果
    return new PaginationResult<>(
      paginationParam.getPageNum(),
      paginationParam.getPageSize(),
      total,
      list
    );
  }

  /**
   * 获取用户详情。
   *
   * @param userId 用户 ID
   * @return 用户详情
   */
  public UserInfo getUserDetail(final long userId) {
    return Optional
      .ofNullable(userMapper.selectInfoById(userId))
      .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "用户不存在"));
  }

  /**
   * 新增用户。
   *
   * @param param 新增用户参数
   */
  public void addUser(final AddUserParam param) {
    // 判断是否存在相同用户名的用户
    Optional
      .ofNullable(userMapper.selectByUsername(param.getUsername()))
      .ifPresent(user -> {
        throw new ApiException(HttpStatus.CONFLICT, "用户名已存在");
      });

    // ----- 新增用户 -----
    final User user = new User();
    user.setCreatedAt(LocalDateTime.now());
    user.setUpdatedAt(LocalDateTime.now());
    user.setRemark(param.getRemark());
    user.setUsername(param.getUsername());
    user.setNickname(param.getNickname());
    user.setStatus(AccountStatus.ENABLED);

    // 设置权限，不能直接分配超级管理员权限
    final String authorities = toStorageAuthorities(param.getAuthorities(), false);
    user.setAuthorities(authorities);

    // 加密密码
    final String password = decrypt(param.getPassword());
    user.setHashedPassword(passwordEncoder.encode(password));

    // 插入到数据库
    userMapper.insert(user);
  }

  /**
   * 更新用户。
   *
   * @param userId 需要更新的用户 ID
   * @param param 更新用户参数
   */
  public void updateUser(final long userId, final UpdateUserParam param) {
    // 判断用户是否存在
    final User user = Optional
      .ofNullable(userMapper.selectById(userId))
      .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "用户不存在"));

    // ----- 不允许更新和分配超级管理员权限 -----
    final String newAuthorities = toStorageAuthorities(param.getAuthorities(), true);
    final boolean updateRoot = hasRoot(user.getAuthorities());
    if (updateRoot && !Objects.equals(user.getAuthorities(), newAuthorities)) {
      throw new ApiException(HttpStatus.FORBIDDEN, "超级管理员账号不允许再调整权限");
    }

    if (!updateRoot && hasRoot(newAuthorities)) {
      throw new ApiException(HttpStatus.FORBIDDEN, "不能直接分配超级管理员权限");
    }

    // ----- 更新用户数据 -----
    user.setUpdatedAt(LocalDateTime.now());
    user.setNickname(param.getNickname());
    user.setAuthorities(newAuthorities);
    user.setRemark(param.getRemark());

    // 更新用户数据到数据库
    userMapper.updateById(user);
  }

  /**
   * 重置用户密码。
   *
   * @param userId 需要重置密码的用户 ID
   * @param param 重置密码参数
   */
  public void resetPassword(final long userId, final ResetPasswordParam param) {
    // 解密密码
    final String password = decrypt(param.getPassword());

    // 判断用户是否存在
    final User user = Optional
      .ofNullable(userMapper.selectById(userId))
      .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "用户不存在"));

    // ----- 更新用户数据 -----
    user.setUpdatedAt(LocalDateTime.now());
    user.setHashedPassword(passwordEncoder.encode(password));

    // 更新用户数据到数据库
    userMapper.updateById(user);

    // ----- 重置密码后需要重新登录 -----
    authService.logout(user.getUsername());
  }

  /**
   * 更新用户状态。
   *
   * @param userId 需要更新的用户 ID
   * @param param 更新用户状态参数
   */
  public void updateUserStatus(
    final long userId,
    final UpdateUserStatusParam param
  ) {
    // 判断用户是否存在
    final User user = Optional
      .ofNullable(userMapper.selectById(userId))
      .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "用户不存在"));

    // 非超级管理员不可操作超级管理员账号
    final boolean updateRoot = hasRoot(user.getAuthorities());
    if (updateRoot) {
      final List<String> currentAuthorities = AuthUtils
        .getCurrentUser()
        .orElseThrow()
        .authorities();
      if (!hasRoot(currentAuthorities)) {
        throw new ApiException(HttpStatus.FORBIDDEN, "非超级管理员不可操作超级管理员账号");
      }
    }

    // ----- 更新用户数据 -----
    user.setUpdatedAt(LocalDateTime.now());
    user.setStatus(AccountStatus.resolve(param.getStatus()).orElseThrow());

    // 更新用户数据到数据库
    userMapper.updateById(user);
  }

  /**
   * 删除用户。
   *
   * @param userId 需要删除的用户 ID
   */
  public void deleteUser(final long userId) {
    // 判断用户是否存在
    final User user = Optional
      .ofNullable(userMapper.selectById(userId))
      .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "用户不存在"));

    // 从数据库中删除用户
    userMapper.deleteById(user.getId());
  }

  private boolean checkIfNeedsUpdatePassword(final String oldPassword, final String newPassword) {
    if (
      !StringUtils.hasText(oldPassword) &&
      !StringUtils.hasText(newPassword)
    ) {
      return false;
    }

    if (
      !StringUtils.hasText(oldPassword) ||
      !StringUtils.hasText(newPassword)
    ) {
      throw new ApiException(HttpStatus.BAD_REQUEST, "旧密码和新密码必须同时提供");
    }

    return true;
  }

  private static String decrypt(final String encryptedPassword) {
    final String password;
    try {
      password = RsaUtils.decrypt(encryptedPassword, AuthServiceImpl.PRIVATE_KEY);
    } catch (Exception e) {
      throw new ApiException(HttpStatus.BAD_REQUEST, "密码错误");
    }

    return password;
  }

  private String toStorageAuthorities(final List<String> authorities, final boolean canRoot) {
    if (authorities == null || authorities.isEmpty()) return null;

    final String authoritiesToSave = authorities
      .stream()
      .distinct()
      .filter(authStr -> {
        if (StringUtils.hasText(authStr)) {
          final Authority auth = Authority
            .resolve(authStr)
            .orElseThrow(() -> new ApiException(
              HttpStatus.BAD_REQUEST,
              "不存在的权限 [%s]".formatted(authStr)
            ));

          if (auth == Authority.ROOT && !canRoot) {
            throw new ApiException(
              HttpStatus.FORBIDDEN,
              "不能直接分配的权限 [%s]".formatted(authStr)
            );
          }

          return true;
        }

        return false;
      })
      .map(String::trim)
      .collect(Collectors.joining(","));
    return authoritiesToSave.isEmpty() ? null : authoritiesToSave;
  }

  private void setFuzzyQueryParams(final GetUserParam param) {
    param.setUsername(StrUtils.toLikeValue(param.getUsername()));
    param.setNickname(StrUtils.toLikeValue(param.getNickname()));
  }

  private static boolean hasRoot(final String authorities) {
    return authorities != null && authorities.contains(Authority.ROOT.getCode());
  }

  private static boolean hasRoot(final List<String> authorities) {
    return authorities != null && authorities.contains(Authority.ROOT.getCode());
  }
}
