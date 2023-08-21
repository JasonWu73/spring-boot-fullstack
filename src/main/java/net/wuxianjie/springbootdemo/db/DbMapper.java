package net.wuxianjie.springbootdemo.db;

import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface DbMapper {

  boolean existsSchema(String schemaName);

  boolean existsTable(String schemaName, String tableName);

  void createSchema(String schemaName);

  void createTable(String schemaName, String tableName);

  void insertData(String schemaName, String tableName, TestData data);

  List<TestData> selectAllData(String schemaName, String tableName);
}
