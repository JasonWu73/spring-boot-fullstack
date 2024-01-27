package net.wuxianjie.backend.shared.oplog;

import java.util.List;
import net.wuxianjie.backend.shared.dto.ChartData;
import net.wuxianjie.backend.shared.oplog.dto.GetOpLogParam;
import net.wuxianjie.backend.shared.pagination.PaginationParam;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

/**
 * 操作日志表 SQL 语句映射器。
 */
@Mapper
public interface OpLogMapper {

  /**
   * 根据查询条件获取操作日志分页列表。
   * <p>
   * 支持排序的列：请求时间。
   *
   * @param paginationParam 分页参数
   * @param logParam 查询条件
   * @return 操作日志分页列表
   */
  List<OpLog> selectByQueryLimit(
    @Param("p") PaginationParam paginationParam,
    @Param("q") GetOpLogParam logParam
  );

  /**
   * 根据查询条件获取操作日志总数。
   *
   * @param logParam 查询条件
   * @return 操作日志总数
   */
  long countByQuery(@Param("q") GetOpLogParam logParam);

  /**
   * 获取登录数前 N 名的用户。
   *
   * @param limit 前 N 名
   * @return 登录数前 N 名的用户
   */
  List<ChartData> selectLoginsLimit(int limit);

  /**
   * 获取当前日期减去 N 天的登录数。
   *
   * @param days 从当前日期减去 N 天
   * @return 当前日期减去 N 天的登录数
   */
  List<ChartData> selectLoginsHistory(int days);

  /**
   * 新增操作日志。
   *
   * @param log 操作日志
   */
  void insert(OpLog log);
}
