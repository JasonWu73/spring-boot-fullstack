package net.wuxianjie.backend.shared.operationlog;

import net.wuxianjie.backend.shared.operationlog.dto.GetLogParam;
import net.wuxianjie.backend.shared.operationlog.dto.ChartData;
import net.wuxianjie.backend.shared.pagination.PaginationParam;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 与操作日志表相关的数据库操作。
 */
@Mapper
public interface LogMapper {

  /**
   * 根据查询条件获取操作日志分页列表。
   * <p>
   * 排序规则：
   *
   * <ul>
   *   <li>由分页参数决定是否按照某个列进行排序</li>
   *   <li>支持排序的列有：请求时间</li>
   * </ul>
   *
   * @param paginationParam 分页参数
   * @param logParam 查询条件
   * @return 操作日志分页列表
   */
  List<OperationLog> selectByQueryLimit(
    @Param("p") PaginationParam paginationParam,
    @Param("q") GetLogParam logParam
  );

  /**
   * 根据查询条件获取操作日志总数。
   *
   * @param logParam 查询条件
   * @return 操作日志总数
   */
  long countByQuery(@Param("q") GetLogParam logParam);

  /**
   * 获取登录数前几的用户。
   *
   * @param limit 前几
   * @return 登录数前几的用户
   */
  List<ChartData> selectLoginsLimit(int limit);

  /**
   * 获取最近几天的登录数。
   *
   * @param days 从当前日期减去几天
   * @return 最近几天的登录数
   */
  List<ChartData> selectLoginsHistory(int days);

  /**
   * 新增操作日志。
   *
   * @param operation 需要新增的操作日志
   */
  void insert(OperationLog operation);
}
