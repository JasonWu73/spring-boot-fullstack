package net.wuxianjie.web.shared.operationlog;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import net.wuxianjie.web.shared.auth.annotation.Admin;
import net.wuxianjie.web.shared.operationlog.dto.GetLogParam;
import net.wuxianjie.web.shared.pagination.PaginationParam;
import net.wuxianjie.web.shared.pagination.PaginationResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 操作日志 API。
 */
@RestController
@RequestMapping("/api/v1/operation-logs")
@RequiredArgsConstructor
public class OperationLogController {

  private final OperationLogService operationLogService;

  /**
   * 获取操作日志分页列表。
   * <p>
   * 权限要求：管理员。
   *
   * @param paginationParam 分页参数
   * @param logParam 查询参数
   * @return 操作日志分页列表
   */
  @Admin
  @GetMapping
  public PaginationResult<OperationLog> getLogs(
    @Valid final PaginationParam paginationParam,
    @Valid final GetLogParam logParam
  ) {
    return operationLogService.getLogs(paginationParam, logParam);
  }
}
