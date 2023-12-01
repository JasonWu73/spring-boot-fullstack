package net.wuxianjie.web.user;

import lombok.RequiredArgsConstructor;
import net.wuxianjie.web.shared.auth.AuthUtils;
import net.wuxianjie.web.shared.auth.Authority;
import net.wuxianjie.web.shared.exception.ApiException;
import net.wuxianjie.web.shared.pagination.PaginationParam;
import net.wuxianjie.web.shared.pagination.PaginationResult;
import net.wuxianjie.web.shared.util.RsaUtils;
import net.wuxianjie.web.shared.util.StrUtils;
import net.wuxianjie.web.user.dto.*;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * 用户相关业务逻辑。
 */
@Service
@RequiredArgsConstructor
public class UserService {

  private final PasswordEncoder passwordEncoder;
  private final AuthServiceImpl authService;
  private final UserMapper userMapper;

  /**
   * 获取当前用户数据。
   *
   * <p>主要用于用户查看自己的个人资料。
   */
  public UserInfo getMe() {
    // 从 Spring Security 中获取当前用户的 id
    final long userId = AuthUtils.getCurrentUser().orElseThrow().userId();

    // 从数据库中查询用户信息并返回
    return Optional.ofNullable(userMapper.selectInfoById(userId))
      .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "用户不存在"));
  }

  /**
   * 更新当前用户信息。
   *
   * <p>主要用于用户更新自己的个人资料。
   *
   * @param param 更新当前用户信息参数
   */
  public void updateMe(final UpdateMeParam param) {
    // 从 Spring Security 中获取当前用户的 id
    final long userId = AuthUtils.getCurrentUser().orElseThrow().userId();

    // 从数据库中查询当前用户数据
    final User user = Optional.ofNullable(userMapper.selectById(userId))
      .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "用户不存在"));

    // 更新用户字段
    user.setUpdatedAt(LocalDateTime.now());
    user.setNickname(param.getNickname());

    // 检查是否需要更新密码
    final boolean needsUpdatePassword = checkIfNeedsUpdatePassword(
      param.getOldPassword(),
      param.getNewPassword()
    );

    if (needsUpdatePassword) {
      // 解密密码
      final String oldPassword = decryptPassword(param.getOldPassword());
      final String newPassword = decryptPassword(param.getNewPassword());

      // 检查新密码是否与旧密码相同
      if (Objects.equals(newPassword, oldPassword)) {
        throw new ApiException(HttpStatus.BAD_REQUEST, "新密码不能与旧密码相同");
      }

      // 检查旧密码是否正确
      if (!passwordEncoder.matches(oldPassword, user.getHashedPassword())) {
        throw new ApiException(HttpStatus.BAD_REQUEST, "旧密码错误");
      }

      // 将明文密码进行 Hash 计算后再更新用户密码字段
      user.setHashedPassword(passwordEncoder.encode(newPassword));
    }

    // 更新数据库中的用户数据
    userMapper.updateById(user);

    // 在密码更新后，需要重新登录
    if (needsUpdatePassword) {
      authService.logout();
    }
  }

  /**
   * 获取用户分页列表。
   *
   * @param paginationParam 分页参数
   * @param userParam       用户查询参数
   * @return 用户分页列表
   */
  public PaginationResult<UserInfo> getUsers(
    final PaginationParam paginationParam,
    final GetUserParam userParam
  ) {
    // 设置模糊查询参数
    userParam.setUsername(StrUtils.toNullableLikeValue(userParam.getUsername()));
    userParam.setNickname(StrUtils.toNullableLikeValue(userParam.getNickname()));

    // 从数据库中查询符合条件的用户列表
    final List<UserInfo> list = userMapper.selectByQueryLimit(paginationParam, userParam);

    // 从数据库中查询符合条件的用户总数
    final long total = userMapper.countByQuery(userParam);

    // 返回用户分页列表
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
   * @param userId 用户 id
   * @return 用户详情
   */
  public UserInfo getUserInfo(final long userId) {
    // 从数据库中查询用户详情并返回
    return Optional.ofNullable(userMapper.selectInfoById(userId))
      .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "用户不存在"));
  }

  /**
   * 新增用户。
   *
   * @param param 新增用户参数
   */
  public void addUser(final AddUserParam param) {
    // 检查用户名是否已存在
    final boolean usernameExists = Optional.ofNullable(
      userMapper.selectByUsername(param.getUsername())
    ).isPresent();

    if (usernameExists) {
      throw new ApiException(HttpStatus.CONFLICT, "用户名已存在");
    }

    // 构造需要保存的用户数据
    final User user = new User();
    user.setCreatedAt(LocalDateTime.now());
    user.setUpdatedAt(LocalDateTime.now());
    user.setRemark(param.getRemark());
    user.setUsername(param.getUsername());
    user.setNickname(param.getNickname());

    // 解密密码
    final String password = decryptPassword(param.getPassword());

    // 将明文密码进行 Hash 计算后再保存
    user.setHashedPassword(passwordEncoder.encode(password));

    // 设置账号状态
    user.setStatus(AccountStatus.ENABLED);

    // 保存用户功能权限
    user.setAuthorities(checkAuthorities(param.getAuthorities(), false));

    // 保存用户至数据库
    userMapper.insert(user);
  }

  /**
   * 更新用户。
   *
   * @param userId 用户 id
   * @param param  更新用户参数
   */
  public void updateUser(final long userId, final UpdateUserParam param) {
    // 从数据库中查询用户数据
    final User user = Optional.ofNullable(userMapper.selectById(userId))
      .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "用户不存在"));

    // 检查是否为 `root` 账号
    final String newAuthorities = checkAuthorities(param.getAuthorities(), true);

    if (isRootAccount(user.getAuthorities())
      && !Objects.equals(user.getAuthorities(), newAuthorities)
    ) {
      throw new ApiException(HttpStatus.FORBIDDEN, "超级管理员账号不允许再调整权限");
    }

    // 更新用户字段
    user.setUpdatedAt(LocalDateTime.now());
    user.setNickname(param.getNickname());
    user.setAuthorities(newAuthorities);
    user.setRemark(param.getRemark());

    // 更新数据库中的用户数据
    userMapper.updateById(user);
  }

  /**
   * 重置用户密码。
   *
   * @param userId 用户 id
   * @param param  重置密码参数
   */
  public void resetPassword(final long userId, final ResetPasswordParam param) {
    // 解密密码
    final String password = decryptPassword(param.getPassword());

    // 从数据库中查询用户数据
    final User user = Optional.ofNullable(userMapper.selectById(userId))
      .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "用户不存在"));

    // 更新用户字段
    user.setUpdatedAt(LocalDateTime.now());

    // 将明文密码进行 Hash 计算后再保存
    user.setHashedPassword(passwordEncoder.encode(password));

    // 更新数据库中的用户数据
    userMapper.updateById(user);

    // 在密码更新后，需要重新登录
    authService.logout(user.getUsername());
  }

  /**
   * 更新用户状态。
   *
   * @param userId 用户 id
   * @param param  更新用户状态参数
   */
  public void updateUserStatus(final long userId, final UpdateUserStatusParam param) {
    // 从数据库中查询用户数据
    final User user = Optional.ofNullable(userMapper.selectById(userId))
      .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "用户不存在"));

    // 更新用户字段
    user.setUpdatedAt(LocalDateTime.now());
    user.setStatus(AccountStatus.resolve(param.getStatus()).orElseThrow());

    // 更新数据库中的用户数据
    userMapper.updateById(user);
  }

  /**
   * 删除用户。
   *
   * @param userId 用户 id
   */
  public void deleteUser(final long userId) {
    // 从数据库中查询用户数据
    final User user = Optional.ofNullable(userMapper.selectById(userId))
      .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "用户不存在"));

    // 从数据库中删除用户数据
    userMapper.deleteById(user.getId());
  }

  private boolean checkIfNeedsUpdatePassword(
    final String oldPassword,
    final String newPassword
  ) {
    if (!StringUtils.hasText(oldPassword) && !StringUtils.hasText(newPassword)) {
      return false;
    }

    if (!StringUtils.hasText(oldPassword) || !StringUtils.hasText(newPassword)) {
      throw new ApiException(HttpStatus.BAD_REQUEST, "旧密码和新密码必须同时提供");
    }

    return true;
  }

  private static String decryptPassword(final String encryptedPassword) {
    final String password;

    try {
      password = RsaUtils.decrypt(encryptedPassword, AuthServiceImpl.PRIVATE_KEY);
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

    return authorities.stream()
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

  private static boolean isRootAccount(final String authorities) {
    return authorities.contains(Authority.ROOT.getCode());
  }
}
