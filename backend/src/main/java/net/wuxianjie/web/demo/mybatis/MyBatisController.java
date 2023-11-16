package net.wuxianjie.web.demo.mybatis;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Validated
@RestController
@RequestMapping("/api/v1/mybatis")
@RequiredArgsConstructor
public class MyBatisController {

  private final MyBatisMapper myBatisMapper;

  /**
   * 测试数据库清空表。
   */
  @DeleteMapping
  public ResponseEntity<Void> deleteAllData() {
    myBatisMapper.truncateTable();
    return ResponseEntity.noContent().build();
  }

  /**
   * 测试数据库查询。
   */
  @GetMapping
  public List<MyBatisData> getAllData() {
    return myBatisMapper.selectAllData();
  }

  /**
   * 测试数据库新增。
   */
  @PostMapping
  public MyBatisData addData(@RequestBody @Valid final MyBatisData data) {
    data.setType(MyBatisType.TYPE_2);
    myBatisMapper.insertData(data);
    return data;
  }
}
