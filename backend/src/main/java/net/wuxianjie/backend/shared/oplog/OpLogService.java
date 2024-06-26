package net.wuxianjie.backend.shared.oplog;

import java.util.List;
import lombok.RequiredArgsConstructor;
import net.wuxianjie.backend.shared.dto.ChartData;
import net.wuxianjie.backend.shared.oplog.dto.GetOpLogParam;
import net.wuxianjie.backend.shared.pagination.PaginationParam;
import net.wuxianjie.backend.shared.pagination.PaginationResult;
import net.wuxianjie.backend.shared.util.StrUtils;
import org.springframework.stereotype.Service;

/**
 * 操作日志业务处理。
 */
@Service
@RequiredArgsConstructor
public class OpLogService {

  private final OpLogMapper opLogMapper;

  /**
   * 获取操作日志分页列表。
   *
   * @param paginationParam 分页参数
   * @param logParam 查询参数
   * @return 操作日志分页列表
   */
  public PaginationResult<OpLog> getLogs(
    final PaginationParam paginationParam,
    final GetOpLogParam logParam
  ) {
    // 设置符合数据库 Like 条件的模糊查询参数
    setFuzzyQueryParams(logParam);

    // 根据查询条件获取分页列表
    final List<OpLog> list = opLogMapper.selectByQueryLimit(paginationParam, logParam);

    // 根据查询条件获取总数
    final long total = opLogMapper.countByQuery(logParam);

    // 返回分页结果
    return new PaginationResult<>(
      paginationParam.getPageNum(),
      paginationParam.getPageSize(),
      total,
      list
    );
  }

  /**
   * 获取登录数前 N 名的用户。
   *
   * @param num 前 N 名
   * @return 登录数前 N 名的用户
   */
  public List<ChartData> getLoginsTop(final int num) {
    return opLogMapper.selectLoginsLimit(num);
  }

  /**
   * 获取最近 N 天的登录数。
   *
   * @param days 最近 N 天
   * @return 最近 N 天的登录数
   */
  public List<ChartData> getLoginsHistory(final int days) {
    return opLogMapper.selectLoginsHistory(days - 1);
  }

  private void setFuzzyQueryParams(final GetOpLogParam param) {
    param.setClientIp(StrUtils.toLikeValue(param.getClientIp()));
    param.setUsername(StrUtils.toLikeValue(param.getUsername()));
    param.setMessage(StrUtils.toLikeValue(param.getMessage()));
  }
}
