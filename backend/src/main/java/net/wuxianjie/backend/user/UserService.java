package net.wuxianjie.backend.user;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import net.wuxianjie.backend.shared.auth.AuthUtils;
import net.wuxianjie.backend.shared.auth.Authority;
import net.wuxianjie.backend.shared.exception.ApiException;
import net.wuxianjie.backend.shared.page.PageParam;
import net.wuxianjie.backend.shared.page.PageResult;
import net.wuxianjie.backend.shared.util.RsaUtils;
import net.wuxianjie.backend.shared.util.StrUtils;
import net.wuxianjie.backend.user.dto.*;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

/**
 * 用户业务逻辑实现。
 */
@Service
@RequiredArgsConstructor
public class UserService {

  private final PasswordEncoder passwordEncoder;

  private final AuthServiceImpl authService;
  private final UserMapper userMapper;

  /**
   * 获取当前用户数据。
   * <p>
   * 从 Spring Security 中获取当前用户的 id，然后从数据库中查询用户数据并返回。
   */
  public UserInfo getMe() {
    final long userId = AuthUtils.getCurrentUser().orElseThrow().userId();

    return Optional
      .ofNullable(userMapper.selectInfoById(userId))
      .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "用户不存在"));
  }

  /**
   * 更新当前用户信息。
   * <p>
   * 从 Spring Security 中获取当前用户的 id，然后从数据库中查询用户数据并更新。
   * <p>
   * 如果更新了密码，则需要重新登录。
   *
   * @param param 更新当前用户信息参数
   */
  public void updateMe(final UpdateMeParam param) {
    final long userId = AuthUtils.getCurrentUser().orElseThrow().userId();

    final User user = Optional
      .ofNullable(userMapper.selectById(userId))
      .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "用户不存在"));

    user.setUpdatedAt(LocalDateTime.now());
    user.setNickname(param.getNickname());

    final boolean needsUpdatePassword = checkIfNeedsUpdatePassword(
      param.getOldPassword(),
      param.getNewPassword()
    );

    if (needsUpdatePassword) {
      final String oldPassword = decryptPassword(param.getOldPassword());
      final String newPassword = decryptPassword(param.getNewPassword());

      if (Objects.equals(newPassword, oldPassword)) {
        throw new ApiException(
          HttpStatus.BAD_REQUEST,
          "新密码不能与旧密码相同"
        );
      }

      if (!passwordEncoder.matches(oldPassword, user.getHashedPassword())) {
        throw new ApiException(HttpStatus.BAD_REQUEST, "旧密码错误");
      }

      user.setHashedPassword(passwordEncoder.encode(newPassword));
    }

    userMapper.updateById(user);

    if (needsUpdatePassword) {
      authService.logout();
    }
  }

  /**
   * 获取用户分页列表。
   * <p>
   * 需要构造符合数据库 Like 条件的模糊查询参数。
   *
   * @param pageParam 分页参数
   * @param userParam       用户查询参数
   * @return 用户分页列表
   */
  public PageResult<UserInfo> getUsers(
    final PageParam pageParam,
    final GetUserParam userParam
  ) {
    setFuzzyQuery(userParam);

    final List<UserInfo> list = userMapper.selectByQueryLimit(
      pageParam,
      userParam
    );

    final long total = userMapper.countByQuery(userParam);

    return new PageResult<>(
      pageParam.getPageNum(),
      pageParam.getPageSize(),
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
  public UserInfo getUserInfo(final long userId) {
    return Optional
      .ofNullable(userMapper.selectInfoById(userId))
      .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "用户不存在"));
  }

  /**
   * 新增用户。
   *
   * <ul>
   *   <li>不允许创建相同用户名的用户</li>
   *   <li>不允许创建超级管理员账号</li>
   * </ul>
   *
   * @param param 新增用户参数
   */
  public void addUser(final AddUserParam param) {
    final boolean usernameExists = Optional
      .ofNullable(userMapper.selectByUsername(param.getUsername()))
      .isPresent();

    if (usernameExists) {
      throw new ApiException(HttpStatus.CONFLICT, "用户名已存在");
    }

    final User user = new User();

    user.setCreatedAt(LocalDateTime.now());
    user.setUpdatedAt(LocalDateTime.now());
    user.setRemark(param.getRemark());
    user.setUsername(param.getUsername());
    user.setNickname(param.getNickname());
    user.setStatus(AccountStatus.ENABLED);
    user.setAuthorities(checkAuthorities(param.getAuthorities(), false));

    final String password = decryptPassword(param.getPassword());
    user.setHashedPassword(passwordEncoder.encode(password));

    userMapper.insert(user);
  }

  /**
   * 更新用户。
   *
   * <ul>
   *   <li>不允许更新超级管理员账号的权限</li>
   * </ul>
   *
   * @param userId 需要更新数据的用户 ID
   * @param param  更新用户参数
   */
  public void updateUser(final long userId, final UpdateUserParam param) {
    final User user = Optional
      .ofNullable(userMapper.selectById(userId))
      .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "用户不存在"));

    final String newAuthorities = checkAuthorities(
      param.getAuthorities(),
      true
    );

    if (
      isRootAccount(user.getAuthorities()) &&
      !Objects.equals(user.getAuthorities(), newAuthorities)
    ) {
      throw new ApiException(
        HttpStatus.FORBIDDEN,
        "超级管理员账号不允许再调整权限"
      );
    }

    user.setUpdatedAt(LocalDateTime.now());
    user.setNickname(param.getNickname());
    user.setAuthorities(newAuthorities);
    user.setRemark(param.getRemark());

    userMapper.updateById(user);
  }

  /**
   * 重置用户密码。
   * <p>
   * 重置密码后，需要重新登录。
   *
   * @param userId 需要重置密码的用户 ID
   * @param param  重置密码参数
   */
  public void resetPassword(final long userId, final ResetPasswordParam param) {
    final String password = decryptPassword(param.getPassword());

    final User user = Optional
      .ofNullable(userMapper.selectById(userId))
      .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "用户不存在"));

    user.setUpdatedAt(LocalDateTime.now());
    user.setHashedPassword(passwordEncoder.encode(password));

    userMapper.updateById(user);

    authService.logout(user.getUsername());
  }

  /**
   * 更新用户状态。
   *
   * @param userId 需要更新数据的用户 ID
   * @param param 更新用户状态参数
   */
  public void updateUserStatus(
    final long userId,
    final UpdateUserStatusParam param
  ) {
    final User user = Optional
      .ofNullable(userMapper.selectById(userId))
      .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "用户不存在"));

    user.setUpdatedAt(LocalDateTime.now());
    user.setStatus(AccountStatus.resolve(param.getStatus()).orElseThrow());

    userMapper.updateById(user);
  }

  /**
   * 删除用户。
   *
   * @param userId 需要删除的用户 ID
   */
  public void deleteUser(final long userId) {
    final User user = Optional
      .ofNullable(userMapper.selectById(userId))
      .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "用户不存在"));

    userMapper.deleteById(user.getId());
  }

  private boolean checkIfNeedsUpdatePassword(
    final String oldPassword,
    final String newPassword
  ) {
    if (
      !StringUtils.hasText(oldPassword) && !StringUtils.hasText(newPassword)
    ) {
      return false;
    }

    if (
      !StringUtils.hasText(oldPassword) || !StringUtils.hasText(newPassword)
    ) {
      throw new ApiException(
        HttpStatus.BAD_REQUEST,
        "旧密码和新密码必须同时提供"
      );
    }

    return true;
  }

  private static String decryptPassword(final String encryptedPassword) {
    final String password;

    try {
      password =
        RsaUtils.decrypt(encryptedPassword, AuthServiceImpl.PRIVATE_KEY);
    } catch (Exception e) {
      throw new ApiException(HttpStatus.BAD_REQUEST, "密码错误");
    }

    return password;
  }

  private String checkAuthorities(
    final List<String> authorities,
    final boolean canRoot
  ) {
    if (authorities == null || authorities.isEmpty()) return null;

    return authorities
      .stream()
      .distinct()
      .filter(auth -> {
        if (StringUtils.hasText(auth)) {
          final Optional<Authority> authOpt = Authority.resolve(auth);

          if (authOpt.isEmpty()) {
            throw new ApiException(
              HttpStatus.BAD_REQUEST,
              "不存在的权限 [%s]".formatted(auth)
            );
          }

          if (authOpt.get() == Authority.ROOT && !canRoot) {
            throw new ApiException(
              HttpStatus.FORBIDDEN,
              "不能直接分配的权限 [%s]".formatted(auth)
            );
          }

          return true;
        }

        return false;
      })
      .map(String::trim)
      .collect(Collectors.joining(","));
  }

  private void setFuzzyQuery(final GetUserParam userParam) {
    userParam.setUsername(StrUtils.toLikeValue(userParam.getUsername()));
    userParam.setNickname(StrUtils.toLikeValue(userParam.getNickname()));
  }

  private static boolean isRootAccount(final String authorities) {
    return (
      authorities != null && authorities.contains(Authority.ROOT.getCode())
    );
  }
}
