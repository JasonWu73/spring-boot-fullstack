package net.wuxianjie.backend.shared.operationlog;

import java.util.List;
import lombok.RequiredArgsConstructor;
import net.wuxianjie.backend.shared.operationlog.dto.ChartData;
import net.wuxianjie.backend.shared.operationlog.dto.GetLogParam;
import net.wuxianjie.backend.shared.pagination.PaginationParam;
import net.wuxianjie.backend.shared.pagination.PaginationResult;
import net.wuxianjie.backend.shared.util.StrUtils;
import org.springframework.stereotype.Service;

/**
 * 操作日志业务逻辑实现。
 */
@Service
@RequiredArgsConstructor
public class LogService {

  private final LogMapper logMapper;

  /**
   * 获取操作日志分页列表。
   * <p>
   * 需要构造符合数据库 Like 条件的模糊查询参数。
   *
   * @param paginationParam 分页参数
   * @param logParam 查询参数
   * @return 操作日志分页列表
   */
  public PaginationResult<OperationLog> getLogs(
    final PaginationParam paginationParam,
    final GetLogParam logParam
  ) {
    setFuzzyQuery(logParam);

    final List<OperationLog> list = logMapper.selectByQueryLimit(
      paginationParam,
      logParam
    );

    final long total = logMapper.countByQuery(logParam);

    return new PaginationResult<>(
      paginationParam.getPageNum(),
      paginationParam.getPageSize(),
      total,
      list
    );
  }

  /**
   * 获取登录数前三的用户。
   *
   * @param num 前几
   * @return 登录数前三的用户
   */
  public List<ChartData> getLoginsTop(final int num) {
    return logMapper.selectLoginsLimit(num);
  }

  /**
   * 获取最近几天的登录数。
   *
   * @param days 最近几天
   * @return 最近几天的登录数
   */
  public List<ChartData> getLoginsHistory(final int days) {
    return logMapper.selectLoginsHistory(days - 1);
  }

  private void setFuzzyQuery(final GetLogParam logParam) {
    logParam.setClientIp(StrUtils.toLikeValue(logParam.getClientIp()));
    logParam.setUsername(StrUtils.toLikeValue(logParam.getUsername()));
    logParam.setMessage(StrUtils.toLikeValue(logParam.getMessage()));
  }
}
