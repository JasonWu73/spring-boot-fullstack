package net.wuxianjie.web.shared.operationlog;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface OperationLogMapper {

  void insert(OperationLog operation);
}
