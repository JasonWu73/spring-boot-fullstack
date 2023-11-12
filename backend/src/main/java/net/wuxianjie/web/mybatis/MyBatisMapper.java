package net.wuxianjie.web.mybatis;

import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface MyBatisMapper {

  void insertData(MyBatisData data);

  List<MyBatisData> selectAllData();

  void truncateTable();
}
