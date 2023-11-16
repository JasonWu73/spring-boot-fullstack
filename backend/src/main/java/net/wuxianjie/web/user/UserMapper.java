package net.wuxianjie.web.user;

import net.wuxianjie.web.shared.pagination.PaginationParams;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface UserMapper {

  User selectById(long userId);

  User selectByUsername(String username);

  List<UserItem> selectByQueryLimit(
    @Param("p") PaginationParams paginationParams,
    @Param("q") GetUserParams userParams
  );

  long countByQuery(@Param("q") GetUserParams userParams);
}
