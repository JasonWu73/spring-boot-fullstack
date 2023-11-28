package net.wuxianjie.web.shared.operationlog;

import net.wuxianjie.web.shared.pagination.PaginationParam;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface OperationLogMapper {

  void insert(OperationLog operation);

  List<OperationLog> selectByQueryLimit(
    @Param("p") PaginationParam paginationParam,
    @Param("q") GetLogParams logParams
  );

  long countByQuery(@Param("q") GetLogParams logParams);
}
