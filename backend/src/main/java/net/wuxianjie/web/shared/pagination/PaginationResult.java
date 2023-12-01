package net.wuxianjie.web.shared.pagination;

import java.util.List;

/**
 * 分页查询结果。
 *
 * @param pageNum 页码
 * @param pageSize 每页条数
 * @param total 总条数
 * @param list 数据列表
 * @param <T> 数据列表中列表项的类型
 */
public record PaginationResult<T> (
  int pageNum,
  int pageSize,
  long total,
  List<T> list
) {}
