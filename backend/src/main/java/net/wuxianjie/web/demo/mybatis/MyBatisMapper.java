package net.wuxianjie.web.demo.mybatis;

import org.apache.ibatis.annotations.Mapper;

import java.util.List;

/**
 * MyBatis 测试。
 */
@Mapper
public interface MyBatisMapper {

  /**
   * 查询。
   *
   * @return 所有数据
   */
  List<MyBatisData> selectAllData();

  /**
   * 新增。
   *
   * @param data 需要新增的数据
   */
  void insertData(MyBatisData data);

  /**
   * 清空表。
   */
  void truncateTable();
}
