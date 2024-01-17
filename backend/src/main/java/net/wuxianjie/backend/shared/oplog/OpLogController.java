package net.wuxianjie.backend.shared.oplog;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import java.util.List;
import lombok.RequiredArgsConstructor;
import net.wuxianjie.backend.shared.auth.annotation.Admin;
import net.wuxianjie.backend.shared.oplog.dto.ChartData;
import net.wuxianjie.backend.shared.oplog.dto.GetOpLogParam;
import net.wuxianjie.backend.shared.pagination.PaginationParam;
import net.wuxianjie.backend.shared.pagination.PaginationResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 操作日志 API。
 */
@Validated
@RestController
@RequestMapping("/api/v1/op-logs")
@RequiredArgsConstructor
public class OpLogController {

  private final OpLogService opLogService;

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
  public PaginationResult<OpLog> getLogs(
    @Valid final PaginationParam paginationParam,
    @Valid final GetOpLogParam logParam
  ) {
    return opLogService.getLogs(paginationParam, logParam);
  }

  /**
   * 获取登录数前 N 名的用户。
   * <p>
   * 权限要求：管理员。
   *
   * @param num 前 N 名
   * @return 登录数前 N 名的用户
   */
  @Admin
  @GetMapping("/logins-top/{num}")
  public List<ChartData> getLoginsTop(
    @Min(value = 1, message = "不能少于 1 名")
    @Max(value = 10, message = "不能多于 10 名")
    @PathVariable final int num
  ) {
    return opLogService.getLoginsTop(num);
  }

  /**
   * 获取最近 N 天的登录数。
   * <p>
   * 权限要求：管理员。
   *
   * @param days 最近 N 天
   * @return 最近 N 天的登录数
   */
  @Admin
  @GetMapping("/logins-hist/{days}")
  public List<ChartData> getLoginsHist(
    @Min(value = 1, message = "不能少天 1 天")
    @Max(value = 30, message = "不能多于 30 天")
    @PathVariable final int days
  ) {
    return opLogService.getLoginsHist(days);
  }
}
