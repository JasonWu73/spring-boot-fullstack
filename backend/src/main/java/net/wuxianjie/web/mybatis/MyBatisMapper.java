package net.wuxianjie.web.mybatis;

import java.util.List;
import net.wuxianjie.web.mybatis.dto.MyBatisData;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface MyBatisMapper {

  void insertData(MyBatisData data);

  List<MyBatisData> selectAllData();
}
