package net.wuxianjie.springbootdemo.db;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/db")
public class DbController {

  private final DbMapper dbMapper;

  @GetMapping
  public List<TestData> getAllData() {
    return dbMapper.selectAllData(DbInitializer.TEST_DB, DbInitializer.TEST_TABLE);
  }

  @PostMapping
  public void addData() {
    // 构造假数据
    TestData testData = new TestData();
    testData.setName("测试数据-" + ThreadLocalRandom.current().nextInt());

    // 插入数据库
    dbMapper.insertData(DbInitializer.TEST_DB, DbInitializer.TEST_TABLE, testData);
  }
}
