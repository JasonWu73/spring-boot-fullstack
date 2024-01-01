package net.wuxianjie.backend.shared.operationlog;

import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import net.wuxianjie.backend.shared.auth.annotation.Admin;
import net.wuxianjie.backend.shared.operationlog.dto.ChartData;
import net.wuxianjie.backend.shared.operationlog.dto.GetLogParam;
import net.wuxianjie.backend.shared.pagination.PaginationParam;
import net.wuxianjie.backend.shared.pagination.PaginationResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 操作日志 API。
 */
@RestController
@RequestMapping("/api/v1/operation-logs")
@RequiredArgsConstructor
public class LogController {

  private final LogService logService;

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
    return logService.getLogs(paginationParam, logParam);
  }

  /**
   * 获取登录数前几的用户。
   *
   * @param num 前几
   * @return 登录数前几的用户
   */
  @Admin
  @GetMapping("/logins-top/{num}")
  public List<ChartData> getLoginsTop(@PathVariable final int num) {
    return logService.getLoginsTop(num);
  }

  /**
   * 获取最近几天的登录数。
   *
   * @param days 最近几天
   * @return 最近几天的登录数
   */
  @Admin
  @GetMapping("/logins-history/{days}")
  public List<ChartData> getLoginsHistory(@PathVariable final int days) {
    return logService.getLoginsHistory(days);
  }
}
