package net.wuxianjie.web.user;

import lombok.RequiredArgsConstructor;
import net.wuxianjie.web.shared.auth.AuthUtils;
import net.wuxianjie.web.shared.auth.Authority;
import net.wuxianjie.web.shared.auth.CachedAuth;
import net.wuxianjie.web.shared.config.Constants;
import net.wuxianjie.web.shared.exception.ApiException;
import net.wuxianjie.web.shared.pagination.PaginationParam;
import net.wuxianjie.web.shared.pagination.PaginationResult;
import net.wuxianjie.web.shared.util.RsaUtils;
import net.wuxianjie.web.shared.util.StrUtils;
import net.wuxianjie.web.user.dto.AddUserParam;
import net.wuxianjie.web.user.dto.GetUserParam;
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
  private final AuthServiceImpl authService;
  private final UserMapper userMapper;

  public UserInfo getMe() {
    // 从 Spring Security 中获取当前用户的 id
    final long userId = getCurrentUserId();

    // 从数据库中查询当前用户的信息并返回
    return Optional
        .ofNullable(userMapper.selectInfoById(userId))
        .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "用户不存在"));
  }

  public void updateMe(final UpdateMeParam param) {
    // 从 Spring Security 中获取当前用户的 id
    final long userId = getCurrentUserId();

    // 从数据库中查询当前用户数据
    final User user = Optional
        .ofNullable(userMapper.selectById(userId))
        .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "用户不存在"));

    // 检查是否需要更新密码
    boolean passwordUpdated = false;

    if (StringUtils.hasText(param.getOldPassword())) {
      // 检查新密码是否为空
      if (!StringUtils.hasText(param.getNewPassword())) {
        throw new ApiException(HttpStatus.BAD_REQUEST, "新密码不能为空");
      }

      // 解密密码
      final String oldPassword = decrypt(param.getOldPassword());
      final String newPassword = decrypt(param.getNewPassword());

      // 检查新密码是否与旧密码相同
      if (newPassword.equals(oldPassword)) {
        throw new ApiException(HttpStatus.BAD_REQUEST, "新密码不能与旧密码相同");
      }

      // 检查旧密码是否正确
      if (!passwordEncoder.matches(oldPassword, user.getHashedPassword())) {
        throw new ApiException(HttpStatus.BAD_REQUEST, "旧密码错误");
      }

      // 更新密码
      user.setHashedPassword(passwordEncoder.encode(newPassword));

      passwordUpdated = true;
    }

    // 更新数据库中的用户数据
    user.setUpdatedAt(LocalDateTime.now());
    user.setNickname(param.getNickname());

    userMapper.updateById(user);

    // 在密码更新后，需要重新登录
    if (passwordUpdated) {
      authService.logout();
    }
  }

  public PaginationResult<UserInfo> getUsers(
      final PaginationParam paginationParam,
      final GetUserParam userParam
  ) {
    // 设置模糊查询参数
    setFuzzySearchParams(userParam);

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

  public UserInfo getUserInfo(final long userId) {
    // 从数据库中查询用户详情并返回
    return Optional
        .ofNullable(userMapper.selectInfoById(userId))
        .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "用户不存在"));
  }

  public void addUser(final AddUserParam param) {
    // 检查用户名是否已存在
    final boolean usernameExists = Optional
        .ofNullable(userMapper.selectByUsername(param.getUsername()))
        .isPresent();

    if (usernameExists) {
      throw new ApiException(HttpStatus.CONFLICT, "用户名已存在");
    }

    // 保存至数据库
    final User user = new User();

    user.setCreatedAt(LocalDateTime.now());
    user.setUpdatedAt(LocalDateTime.now());
    user.setRemark(param.getRemark());
    user.setUsername(param.getUsername());
    user.setNickname(param.getNickname());

    // 解密密码
    final String password = decrypt(param.getPassword());

    // 将明文密码进行 Hash 计算后再保存
    user.setHashedPassword(passwordEncoder.encode(password));

    // 设置账号状态
    user.setStatus(AccountStatus.ENABLED);

    // 保存用户功能权限
    user.setAuthorities(toAuthorities(param.getAuthorities(), false));

    userMapper.insert(user);
  }

  public void updateUser(final long userId, final UpdateUserParam param) {
    // 从数据库中查询用户数据
    final User user = Optional
        .ofNullable(userMapper.selectById(userId))
        .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "用户不存在"));

    // root 账号不允许再调整权限
    final String newAuthorities = toAuthorities(param.getAuthorities(), true);

    if (user.getAuthorities() != null
        && user.getAuthorities().contains(Authority.ROOT.getCode())
        && !user.getAuthorities().equals(newAuthorities)
    ) {
      throw new ApiException(HttpStatus.FORBIDDEN, "超级管理员账号不允许再调整权限");
    }

    // 更新数据库中的用户数据
    user.setUpdatedAt(LocalDateTime.now());
    user.setNickname(param.getNickname());
    user.setAuthorities(newAuthorities);
    user.setRemark(param.getRemark());

    userMapper.updateById(user);
  }

  public void resetPassword(final long userId, final ResetPasswordParam param) {
    // 解密密码
    final String password = decrypt(param.getPassword());

    // 从数据库中查询用户数据
    final User user = Optional
        .ofNullable(userMapper.selectById(userId))
        .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "用户不存在"));

    // 将明文密码进行 Hash 计算后再保存
    user.setHashedPassword(passwordEncoder.encode(password));

    // 更新数据库中的用户数据
    user.setUpdatedAt(LocalDateTime.now());

    userMapper.updateById(user);

    // 在密码更新后，需要重新登录
    authService.logout(user.getUsername());
  }

  public void updateUserStatus(final long userId, final UpdateUserStatusParam param) {
    // 从数据库中查询用户数据
    final User user = Optional
        .ofNullable(userMapper.selectById(userId))
        .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "用户不存在"));

    // 更新数据库中的用户数据
    user.setUpdatedAt(LocalDateTime.now());
    user.setStatus(AccountStatus.resolve(param.getStatus()).orElseThrow());

    userMapper.updateById(user);
  }

  public void deleteUser(final long userId) {
    // 从数据库中查询用户数据
    final User user = Optional
        .ofNullable(userMapper.selectById(userId))
        .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "用户不存在"));

    // 删除用户
    userMapper.deleteById(user.getId());
  }

  private String toAuthorities(final List<String> authorities, final boolean canRoot) {
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
                  "权限 [%s] 不存在".formatted(auth)
              );
            }

            if (authOpt.get() == Authority.ROOT && !canRoot) {
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

  private static long getCurrentUserId() {
    // 从 Spring Security 中获取当前用户的 id
    final CachedAuth auth = AuthUtils.getCurrentUser().orElseThrow();

    return auth.userId();
  }

  private void setFuzzySearchParams(final GetUserParam userParam) {
    // 设置模糊查询参数
    userParam.setUsername(StrUtils.toNullableLikeValue(userParam.getUsername()));
    userParam.setNickname(StrUtils.toNullableLikeValue(userParam.getNickname()));
  }

  private static String decrypt(final String encryptedPassword) {
    // 解密密码
    final String password;

    try {
      password = RsaUtils.decrypt(encryptedPassword, Constants.RSA_PRIVATE_KEY);
    } catch (Exception e) {
      throw new ApiException(HttpStatus.BAD_REQUEST, "密码错误");
    }

    return password;
  }
}
