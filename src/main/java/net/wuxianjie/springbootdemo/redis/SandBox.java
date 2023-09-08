package net.wuxianjie.springbootdemo.redis;

import cn.hutool.core.lang.Console;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.dao.DataAccessException;
import org.springframework.data.redis.connection.StringRedisConnection;
import org.springframework.data.redis.core.RedisCallback;
import org.springframework.data.redis.core.RedisOperations;
import org.springframework.data.redis.core.SessionCallback;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class SandBox implements CommandLineRunner {

  private final StringRedisTemplate redisTemplate;

  @Override
  public void run(String... args) {
    // 模拟多线程不安全的情况
    new Thread(this::usingTransaction).start();
    new Thread(this::usingTransaction).start();
    addMultiItem();
  }

  private void usingTransaction() {
    List<Object> txResults = redisTemplate.execute(new SessionCallback<>() {
      @Override
      public List<Object> execute(RedisOperations operations) throws DataAccessException {
        operations.watch("list");

        operations.multi();

        addItem();

        return operations.exec();
      }
    });

    Console.log("txResults: {}", txResults);
  }

  private void currencyIssue() {
    boolean isEmpty = isEmpty();
    if (!isEmpty) {
      return;
    }

    addItem();
  }

  private void addItem() {
    redisTemplate.opsForList().rightPush("list", "a");
  }

  private boolean isEmpty() {
    Long size = redisTemplate.opsForList().size("list");
    return size == null || size == 0;
  }

  private void addMultiItem() {
    List<Object> results = redisTemplate.executePipelined((RedisCallback<?>) connection -> {
      StringRedisConnection conn = (StringRedisConnection) connection;

      conn.listCommands().rPush("nums".getBytes(), "1".getBytes());
      conn.listCommands().rPush("nums".getBytes(), "2".getBytes());
      conn.listCommands().rPush("nums".getBytes(), "3".getBytes());
      conn.listCommands().rPush("nums".getBytes(), "4".getBytes());

      return null;
    });

    Console.log("results: {}", results);
  }
}