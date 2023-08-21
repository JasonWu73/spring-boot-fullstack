package net.wuxianjie.springbootdemo.db;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DbInitializer implements CommandLineRunner {

  public static final String TEST_DB = "test_del";
  public static final String TEST_TABLE = "test";

  private final DbMapper dbMapper;

  @Override
  public void run(String... args) {
    // 若 test_db 数据库不存在，则创建
    boolean isTestDbExists = dbMapper.existsSchema(TEST_DB);
    if (!isTestDbExists) {
      dbMapper.createSchema(TEST_DB);
    }

    // 若 test 表不存在，则创建
    boolean isTestTableExists = dbMapper.existsTable(TEST_DB, TEST_TABLE);
    if (!isTestTableExists) {
      dbMapper.createTable(TEST_DB, TEST_TABLE);
    }
  }
}
