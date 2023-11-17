package net.wuxianjie.web.user;

import lombok.RequiredArgsConstructor;
import net.wuxianjie.web.shared.auth.AuthUtils;
import net.wuxianjie.web.shared.auth.CachedAuth;
import net.wuxianjie.web.shared.exception.ApiException;
import net.wuxianjie.web.shared.pagination.PaginationParams;
import net.wuxianjie.web.shared.pagination.PaginationResult;
import net.wuxianjie.web.shared.util.StrUtils;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

  private final UserMapper userMapper;

  public UserInfo getMe() {
    // 从 Spring Security 中获取当前用户的 id
    final CachedAuth auth = AuthUtils.getCurrentUser().orElseThrow();
    final long userId = auth.userId();

    // 从数据库中查询当前用户的基本信息并返回
    return Optional.ofNullable(userMapper.selectInfoById(userId))
      .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "用户不存在"));
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

  public UserInfo getUserDetails(final long userId) {
    // 从数据库中查询用户详情并返回
    return Optional.ofNullable(userMapper.selectInfoById(userId))
      .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "用户不存在"));
  }
}
