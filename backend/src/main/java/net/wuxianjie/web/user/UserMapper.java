package net.wuxianjie.web.user;

import net.wuxianjie.web.shared.pagination.PaginationParam;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface UserMapper {

  User selectById(long userId);

  User selectByUsername(String username);

  UserInfo selectInfoById(long userId);

  List<UserInfo> selectByQueryLimit(
    @Param("p") PaginationParam paginationParam,
    @Param("q") GetUserParams userParams
  );

  long countByQuery(@Param("q") GetUserParams userParams);

  void insert(User user);

  void updateById(User user);

  void deleteById(long userId);
}
