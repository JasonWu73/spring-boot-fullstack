package net.wuxianjie.web.user;

import lombok.RequiredArgsConstructor;
import net.wuxianjie.web.shared.pagination.PaginationParams;
import net.wuxianjie.web.shared.pagination.PaginationResult;
import net.wuxianjie.web.shared.util.StrUtils;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

  private final UserMapper userMapper;

  public PaginationResult<UserItem> getUsers(
    final PaginationParams paginationParams,
    final GetUserParams userParams
  ) {
    // 设置模糊查询参数
    userParams.setUsername(StrUtils.toNullableLikeValue(userParams.getUsername()));
    userParams.setNickname(StrUtils.toNullableLikeValue(userParams.getNickname()));

    // 从数据库中查询符合条件的用户列表
    final List<UserItem> list = userMapper.selectByQueryLimit(paginationParams, userParams);

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
}
