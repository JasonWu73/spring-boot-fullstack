package net.wuxianjie.web.demo.mybatis;

import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface MyBatisMapper {

  List<MyBatisData> selectAllData();

  void insertData(MyBatisData data);

  void truncateTable();
}
