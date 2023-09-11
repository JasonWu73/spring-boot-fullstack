package net.wuxianjie.springbootdemo.redis;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.dao.DataAccessException;
import org.springframework.data.redis.core.RedisCallback;
import org.springframework.data.redis.core.RedisOperations;
import org.springframework.data.redis.core.SessionCallback;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;
import java.util.concurrent.TimeUnit;

@Component
@RequiredArgsConstructor
public class SandBox implements CommandLineRunner {

  public static final String PREFIX_KEY_BIDS = "bids:";
  public static final String PREFIX_KEY_CARS = "cars:";
  public static final String PREFIX_KEY_LOCKS = "locks:";

  private final StringRedisTemplate redisTemplate;
  private final ObjectMapper objectMapper;

  @Override
  public void run(String... args) {
    // ==== 复现多线程问题 ====

    // 填充测试数据
    Car car = new Car(1L, "BMW", 5.0);
    resetTestData(car);

    // 两个线程写入报价
//    new Thread(() -> addBid(1, 22.0)).start();
//    new Thread(() -> addBid(1, 18.0)).start();

    // ==== 分布式锁 Redlock ====

    Thread thread = new Thread(() -> addBidWithLock(1, 22.0));
    thread.setName("22价");
    thread.start();

    Thread thread1 = new Thread(() -> addBidWithLock(1, 18.0));
    thread1.setName("18价");
    thread1.start();

    new Thread(() -> addBidWithLock(1, 25)).start();
    new Thread(() -> addBidWithLock(1, 27)).start();
    new Thread(() -> addBidWithLock(1, 29)).start();
    new Thread(() -> addBidWithLock(1, 30)).start();
    new Thread(() -> addBidWithLock(1, 32)).start();
    new Thread(() -> addBidWithLock(1, 35)).start();
  }

  private String acquireLock(String lockKey, int acquireTimeout, int lockTimeout) {
    int intervalMs = 200;
    String token = UUID.randomUUID().toString();
    long end = System.currentTimeMillis() + acquireTimeout;

    while (System.currentTimeMillis() < end) {
      Boolean locked = redisTemplate.opsForValue().setIfAbsent(lockKey, token, Duration.of(lockTimeout, ChronoUnit.MILLIS));
      if (Boolean.TRUE == locked) {
        return token;
      }

      try {
        TimeUnit.MILLISECONDS.sleep(intervalMs);
      } catch (InterruptedException ignore) {
        Thread.currentThread().interrupt();
      }
    }

    return null;
  }

  private boolean releaseLock(String lockKey, String token) {
    Object execute = redisTemplate.execute(new SessionCallback<>() {
      @SuppressWarnings({"NullableProblems", "unchecked"})
      @Override
      public Object execute(RedisOperations operations) throws DataAccessException {
        operations.watch(lockKey);

        if (!token.equals(redisTemplate.opsForValue().get(lockKey))) {
          operations.unwatch();
          return null;
        }

        operations.multi();

        operations.delete(lockKey);

        return operations.exec();
      }
    });

    return execute != null;
  }

  private void addBidWithLock(long carId, double bid) {
    // 获取锁
    String lockKey = PREFIX_KEY_LOCKS + PREFIX_KEY_BIDS + carId;

    String token = acquireLock(lockKey, 5000, 2000);
    if (token == null) {
      System.out.printf("无法获取锁 [%s]%n", lockKey);
      return;
    }

    // 执行业务逻辑
    addBid(carId, bid);

    // 模拟耗时操作
//    int secs = ThreadLocalRandom.current().nextInt(1, 3);
//    sleep(secs);
//    System.out.printf("竞价操作 [%s - %ss] 完成%n", Thread.currentThread().getName(), secs);

    // 释放锁
    boolean release = releaseLock(lockKey, token);
    System.out.printf("解锁: [%s - %s]%n", Thread.currentThread().getName(), release);
  }

  private void sleep(int secs) {
    try {
      TimeUnit.SECONDS.sleep(secs);
    } catch (InterruptedException e) {
      throw new RuntimeException(e);
    }
  }

  private void addBid(long carId, double bid) {
    redisTemplate.executePipelined((RedisCallback<?>) connection -> {
      String bidStr = (String) redisTemplate.opsForHash().get(PREFIX_KEY_CARS + carId, "bid");
      double preBid = bidStr == null ? 0 : Double.parseDouble(bidStr);
      if (bid <= preBid) {
        System.out.printf("价格过低 [%s <= %s]，不支持竞价%n", bid, preBid);
        return null;
      }

      redisTemplate.opsForHash().put(PREFIX_KEY_CARS + carId, "bid", String.valueOf(bid));

      redisTemplate.opsForList().rightPush(PREFIX_KEY_BIDS + PREFIX_KEY_CARS + carId, String.valueOf(bid));

      return null;
    });
  }

  private void addBidWithTransaction(long carId, double bid) {
    redisTemplate.execute(new SessionCallback<List<Object>>() {
      @SuppressWarnings({"unchecked", "NullableProblems"})
      @Override
      public List<Object> execute(RedisOperations operations) throws DataAccessException {
        operations.watch(PREFIX_KEY_CARS + carId);

        String bidStr = (String) operations.opsForHash().get(PREFIX_KEY_CARS + carId, "bid");
        double preBid = bidStr == null ? 0 : Double.parseDouble(bidStr);
        if (bid <= preBid) {
          System.out.printf("价格过低 [%s <= %s]，不支持竞价%n", bid, preBid);
          operations.unwatch();
          return null;
        }

        operations.multi();

        operations.opsForHash().put(PREFIX_KEY_CARS + carId, "bid", String.valueOf(bid));

        operations.opsForList().rightPush(PREFIX_KEY_BIDS + PREFIX_KEY_CARS + carId, String.valueOf(bid));

        return operations.exec();
      }
    });
  }

  private void resetTestData(Car car) {
    Map<String, String> carMap = objectMapper.convertValue(car, new TypeReference<>() {});
    redisTemplate.opsForHash().putAll(PREFIX_KEY_CARS + car.id(), carMap);

    redisTemplate.delete(PREFIX_KEY_BIDS + PREFIX_KEY_CARS + car.id());
  }
}

record Car(Long id, String name, double bid) {}