package net.wuxianjie.web.shared.operationlog;

import lombok.RequiredArgsConstructor;
import net.wuxianjie.web.shared.pagination.PaginationParams;
import net.wuxianjie.web.shared.pagination.PaginationResult;
import net.wuxianjie.web.shared.util.StrUtils;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OperationLogService {

  private final OperationLogMapper operationLogMapper;

  public PaginationResult<OperationLog> getLogs(
    final PaginationParams paginationParams,
    final GetLogParams logParams
  ) {
    // 设置模糊查询参数
    logParams.setClientIp(StrUtils.toNullableLikeValue(logParams.getClientIp()));
    logParams.setUsername(StrUtils.toNullableLikeValue(logParams.getUsername()));
    logParams.setMessage(StrUtils.toNullableLikeValue(logParams.getMessage()));

    // 从数据库中查询符合条件的操作日志列表
    final List<OperationLog> list = operationLogMapper.selectByQueryLimit(
      paginationParams,
      logParams
    );

    // 从数据库中查询符合条件的操作日志总数
    final long total = operationLogMapper.countByQuery(logParams);

    // 返回操作日志分页列表
    return new PaginationResult<>(
      paginationParams.getPageNum(),
      paginationParams.getPageSize(),
      total,
      list
    );
  }
}
