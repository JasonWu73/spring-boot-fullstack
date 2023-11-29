package net.wuxianjie.web.shared.operationlog;

import lombok.RequiredArgsConstructor;
import net.wuxianjie.web.shared.operationlog.dto.GetLogParam;
import net.wuxianjie.web.shared.pagination.PaginationParam;
import net.wuxianjie.web.shared.pagination.PaginationResult;
import net.wuxianjie.web.shared.util.StrUtils;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 操作日志相关业务逻辑。
 */
@Service
@RequiredArgsConstructor
public class OperationLogService {

  private final OperationLogMapper operationLogMapper;

  /**
   * 获取操作日志分页列表。
   *
   * @param paginationParam 分页参数
   * @param logParam        查询参数
   * @return 操作日志分页列表
   */
  public PaginationResult<OperationLog> getLogs(
    final PaginationParam paginationParam,
    final GetLogParam logParam
  ) {
    // 设置模糊查询参数
    logParam.setClientIp(StrUtils.toNullableLikeValue(logParam.getClientIp()));
    logParam.setUsername(StrUtils.toNullableLikeValue(logParam.getUsername()));
    logParam.setMessage(StrUtils.toNullableLikeValue(logParam.getMessage()));

    // 从数据库中查询符合条件的操作日志列表
    final List<OperationLog> list = operationLogMapper.selectByQueryLimit(
      paginationParam,
      logParam
    );

    // 从数据库中查询符合条件的操作日志总数
    final long total = operationLogMapper.countByQuery(logParam);

    // 返回操作日志分页列表
    return new PaginationResult<>(
      paginationParam.getPageNum(),
      paginationParam.getPageSize(),
      total,
      list
    );
  }
}
