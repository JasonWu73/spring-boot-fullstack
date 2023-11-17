package net.wuxianjie.web.user;

import lombok.RequiredArgsConstructor;
import net.wuxianjie.web.shared.auth.AuthUtils;
import net.wuxianjie.web.shared.auth.Authority;
import net.wuxianjie.web.shared.auth.CachedAuth;
import net.wuxianjie.web.shared.exception.ApiException;
import net.wuxianjie.web.shared.pagination.PaginationParams;
import net.wuxianjie.web.shared.pagination.PaginationResult;
import net.wuxianjie.web.shared.util.StrUtils;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

  private final PasswordEncoder passwordEncoder;

  private final UserMapper userMapper;
  private final AuthServiceImpl authService;

  public UserInfo getMe() {
    // 从 Spring Security 中获取当前用户的 id
    final CachedAuth auth = AuthUtils.getCurrentUser().orElseThrow();
    final long userId = auth.userId();

    // 从数据库中查询当前用户的信息并返回
    return Optional.ofNullable(userMapper.selectInfoById(userId))
      .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "用户不存在"));
  }

  public void updateMe(final UpdateMeParams params) {
    // 从 Spring Security 中获取当前用户的 id
    final CachedAuth auth = AuthUtils.getCurrentUser().orElseThrow();
    final long userId = auth.userId();

    // 从数据库中查询当前用户数据
    final User user = Optional.ofNullable(userMapper.selectById(userId))
      .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "用户不存在"));

    // 检查是否需要更新密码
    boolean passwordUpdated = false;
    if (StringUtils.hasText(params.getOldPassword())) {
      // 检查新密码是否为空
      if (!StringUtils.hasText(params.getNewPassword())) {
        throw new ApiException(HttpStatus.BAD_REQUEST, "新密码不能为空");
      }

      // 检查新密码是否与旧密码相同
      if (params.getNewPassword().equals(params.getOldPassword())) {
        throw new ApiException(HttpStatus.BAD_REQUEST, "新密码不能与旧密码相同");
      }

      // 检查旧密码是否正确
      if (!passwordEncoder.matches(params.getOldPassword(), user.getHashedPassword())) {
        throw new ApiException(HttpStatus.BAD_REQUEST, "旧密码错误");
      }

      // 更新密码
      user.setHashedPassword(passwordEncoder.encode(params.getNewPassword()));
      passwordUpdated = true;
    }

    // 更新数据库中的用户数据
    user.setUpdatedAt(LocalDateTime.now());
    user.setNickname(params.getNickname());
    userMapper.updateById(user);

    // 在密码更新后，需要重新登录
    if (passwordUpdated) {
      authService.logout();
    }
  }

  public PaginationResult<UserInfo> getUsers(
    final PaginationParams paginationParams,
    final GetUserParams userParams
  ) {
    // 设置模糊查询参数
    userParams.setUsername(StrUtils.toNullableLikeValue(userParams.getUsername()));
    userParams.setNickname(StrUtils.toNullableLikeValue(userParams.getNickname()));

    // 从数据库中查询符合条件的用户列表
    final List<UserInfo> list = userMapper.selectByQueryLimit(paginationParams, userParams);

    // 从数据库中查询符合条件的用户总数
    final long total = userMapper.countByQuery(userParams);

    // 返回用户分页列表
    return new PaginationResult<>(
      paginationParams.getPageNum(),
      paginationParams.getPageSize(),
      total,
      list
    );
  }

  public UserInfo getUserInfo(final long userId) {
    // 从数据库中查询用户详情并返回
    return Optional.ofNullable(userMapper.selectInfoById(userId))
      .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "用户不存在"));
  }

  public void addUser(final AddUserParams params) {
    // 检查用户名是否已存在
    final boolean usernameExists = Optional.ofNullable(
        userMapper.selectByUsername(params.getUsername())
      )
      .isPresent();
    if (usernameExists) {
      throw new ApiException(HttpStatus.CONFLICT, "用户名已存在");
    }

    // 保存至数据库
    final User user = new User();
    user.setCreatedAt(LocalDateTime.now());
    user.setUpdatedAt(LocalDateTime.now());
    user.setRemark(params.getRemark());
    user.setUsername(params.getUsername());
    user.setNickname(params.getNickname());

    // 将明文密码进行 Hash 计算后再保存
    user.setHashedPassword(passwordEncoder.encode(params.getPassword()));

    // 设置用户状态
    user.setStatus(AccountStatus.ENABLED);

    // 保存用户功能权限
    user.setAuthorities(toAuthorities(params.getAuthorities()));

    userMapper.insert(user);
  }

  public void updateUser(final long userId, final UpdateUserParams params) {
    // 从数据库中查询用户数据
    final User user = Optional.ofNullable(userMapper.selectById(userId))
      .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "用户不存在"));

    // 更新数据库中的用户数据
    user.setUpdatedAt(LocalDateTime.now());
    user.setNickname(params.getNickname());
    user.setAuthorities(toAuthorities(params.getAuthorities()));
    user.setRemark(params.getRemark());

    userMapper.updateById(user);
  }

  public void resetPassword(final long userId, final ResetPasswordParams params) {
    // 从数据库中查询用户数据
    final User user = Optional.ofNullable(userMapper.selectById(userId))
      .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "用户不存在"));

    // 将明文密码进行 Hash 计算后再保存
    user.setHashedPassword(passwordEncoder.encode(params.getPassword()));

    // 更新数据库中的用户数据
    user.setUpdatedAt(LocalDateTime.now());
    userMapper.updateById(user);

    // 在密码更新后，需要重新登录
    authService.logout();
  }

  public void updateUserStatus(final long userId, final UpdateUserStatusParams params) {
    // 从数据库中查询用户数据
    final User user = Optional.ofNullable(userMapper.selectById(userId))
      .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "用户不存在"));

    // 更新数据库中的用户数据
    user.setUpdatedAt(LocalDateTime.now());
    user.setStatus(AccountStatus.resolve(params.getStatus()).orElseThrow());

    userMapper.updateById(user);
  }

  public void deleteUser(final long userId) {
    // 从数据库中查询用户数据
    final User user = Optional.ofNullable(userMapper.selectById(userId))
      .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "用户不存在"));

    // 删除用户
    userMapper.deleteById(user.getId());
  }

  private String toAuthorities(List<String> authorities) {
    if (authorities == null || authorities.isEmpty()) return null;

    return authorities.
      stream()
      .distinct()
      .filter(auth -> {
        if (StringUtils.hasText(auth)) {
          final Optional<Authority> authOpt = Authority.resolve(auth);
          if (authOpt.isEmpty()) {
            throw new ApiException(
              HttpStatus.BAD_REQUEST,
              "权限 [%s] 不存在".formatted(auth)
            );
          }

          if (authOpt.get() == Authority.ROOT) {
            throw new ApiException(
              HttpStatus.FORBIDDEN,
              "权限 [%s] 不能直接分配".formatted(auth)
            );
          }

          return true;
        }

        return false;
      })
      .map(String::trim)
      .collect(Collectors.joining(","));
  }
}
