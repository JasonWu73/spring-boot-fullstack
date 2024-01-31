package net.wuxianjie.backend.user;

import java.util.List;
import net.wuxianjie.backend.shared.pagination.PaginationParam;
import net.wuxianjie.backend.user.dto.GetUserParam;
import net.wuxianjie.backend.user.dto.UserInfo;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

/**
 * 用户表 SQL 语句映射器。
 */
@Mapper
public interface UserMapper {

  /**
   * 根据用户 ID 查询用户。
   *
   * @param userId 用户 ID
   * @return 用户表数据
   */
  User selectById(long userId);

  /**
   * 根据用户名查询用户。
   *
   * @param username 用户名
   * @return 用户表数据
   */
  User selectByUsername(String username);

  /**
   * 根据用户 ID 查询用户信息。
   *
   * @param userId 用户 ID
   * @return 用户信息
   */
  UserInfo selectDetailById(long userId);

  /**
   * 根据查询条件获取用户分页列表。
   * <p>
   * 支持排序的列：创建时间、更新时间。
   *
   * @param paginationParam 分页参数
   * @param userParam 查询条件
   * @return 用户分页列表
   */
  List<UserInfo> selectByQueryLimit(
    @Param("p") PaginationParam paginationParam,
    @Param("q") GetUserParam userParam
  );

  /**
   * 根据查询条件获取用户总数。
   *
   * @param userParam 查询条件
   * @return 用户总数
   */
  long countByQuery(@Param("q") GetUserParam userParam);

  /**
   * 新增用户。
   *
   * @param user 用户数据
   */
  void insert(User user);

  /**
   * 根据用户 ID 更新用户。
   *
   * @param user 最新的用户数据
   */
  void updateById(User user);

  /**
   * 根据用户 ID 删除用户。
   *
   * @param userId 用户 ID
   */
  void deleteById(long userId);
}
