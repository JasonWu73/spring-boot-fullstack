package net.wuxianjie.backend.shared.operationlog;

import lombok.RequiredArgsConstructor;
import net.wuxianjie.backend.shared.operationlog.dto.GetLogParam;
import net.wuxianjie.backend.shared.pagination.PaginationParam;
import net.wuxianjie.backend.shared.pagination.PaginationResult;
import net.wuxianjie.backend.shared.util.StrUtils;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 操作日志业务逻辑实现。
 */
@Service
@RequiredArgsConstructor
public class OperationLogService {

  private final OperationLogMapper operationLogMapper;

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

    final List<OperationLog> list = operationLogMapper.selectByQueryLimit(
      paginationParam,
      logParam
    );

    final long total = operationLogMapper.countByQuery(logParam);

    return new PaginationResult<>(
      paginationParam.getPageNum(),
      paginationParam.getPageSize(),
      total,
      list
    );
  }

  private void setFuzzyQuery(final GetLogParam logParam) {
    logParam.setClientIp(StrUtils.toLikeValue(logParam.getClientIp()));
    logParam.setUsername(StrUtils.toLikeValue(logParam.getUsername()));
    logParam.setMessage(StrUtils.toLikeValue(logParam.getMessage()));
  }
}
