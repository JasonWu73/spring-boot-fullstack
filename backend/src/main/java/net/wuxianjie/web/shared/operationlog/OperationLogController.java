package net.wuxianjie.web.shared.operationlog;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import net.wuxianjie.web.shared.auth.Admin;
import net.wuxianjie.web.shared.pagination.PaginationParams;
import net.wuxianjie.web.shared.pagination.PaginationResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/operation-logs")
@RequiredArgsConstructor
public class OperationLogController {

  private final OperationLogService operationLogService;

  /**
   * 获取操作日志分页列表。
   */
  @Admin
  @GetMapping
  public PaginationResult<OperationLog> getLogs(
    @Valid final PaginationParams paginationParams,
    @Valid final GetLogParams logParams
  ) {
    return operationLogService.getLogs(paginationParams, logParams);
  }
}
