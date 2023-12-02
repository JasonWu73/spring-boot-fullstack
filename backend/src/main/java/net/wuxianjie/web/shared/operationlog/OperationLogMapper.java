package net.wuxianjie.web.shared.operationlog;

import net.wuxianjie.web.shared.operationlog.dto.GetLogParam;
import net.wuxianjie.web.shared.pagination.PaginationParam;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 与操作日志表相关的数据库操作。
 */
@Mapper
public interface OperationLogMapper {

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
   * 新增操作日志。
   *
   * @param operation 需要新增的操作日志
   */
  void insert(OperationLog operation);
}
