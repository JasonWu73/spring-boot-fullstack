package net.wuxianjie.backend.demo.mybatis;

import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * MyBatis 测试。
 */
@RestController
@RequestMapping("/api/v1/public/mybatis")
@RequiredArgsConstructor
public class MyBatisController {

  private final MyBatisMapper myBatisMapper;

  /**
   * 查询。
   */
  @GetMapping
  public List<MyBatisData> getAllData() {
    return myBatisMapper.selectAllData();
  }

  /**
   * 新增。
   */
  @PostMapping
  public MyBatisData addData(@RequestBody @Valid final MyBatisData data) {
    data.setType(MyBatisType.TYPE_2);
    myBatisMapper.insertData(data);
    return data;
  }

  /**
   * 新增失败（事务管理）。
   */
  @PostMapping("/failed")
  @Transactional(rollbackFor = Exception.class)
  public MyBatisData addDataWithTransaction(@RequestBody @Valid final MyBatisData data) {
    data.setType(MyBatisType.TYPE_2);
    myBatisMapper.insertData(data);

    int i = 1 / 0;
    System.out.println(i);

    return data;
  }

  /**
   * 清空表。
   */
  @DeleteMapping
  public ResponseEntity<Void> deleteAllData() {
    myBatisMapper.truncateTable();
    return ResponseEntity.noContent().build();
  }
}
