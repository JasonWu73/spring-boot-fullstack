package net.wuxianjie.web.shared.operationlog;

import net.wuxianjie.web.shared.pagination.PaginationParam;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface OperationLogMapper {

  List<OperationLog> selectByQueryLimit(
      @Param("p") PaginationParam paginationParam,
      @Param("q") GetLogParam logParam
  );

  long countByQuery(@Param("q") GetLogParam logParam);

  void insert(OperationLog operation);
}
