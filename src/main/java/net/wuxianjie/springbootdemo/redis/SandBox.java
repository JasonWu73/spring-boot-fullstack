package net.wuxianjie.springbootdemo.redis;

import cn.hutool.core.lang.Console;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Component
@RequiredArgsConstructor
public class SandBox implements CommandLineRunner {

  private final StringRedisTemplate redisTemplate;
  private final ObjectMapper objectMapper;

  @Override
  public void run(String... args) throws InterruptedException {
    // 模拟记录并获取竞拍历史

    // 第一次竞拍
    createBid(20.5);

    // 等待 5 秒
    TimeUnit.SECONDS.sleep(5);

    // 第二次竞拍
    createBid(100.0);

    // 获取竞拍历史
    List<Bid> bids = getBidHistories(0, 2);
    Console.log("最近两次的竞拍历史: {}", bids);

    List<Bid> bids2 = getBidHistories(2, 2);
    Console.log("上两次的竞拍历史: {}", bids2);
  }

  private List<Bid> getBidHistories(int offset, int count) {
    List<String> bids = redisTemplate.opsForList().range("bids", -(offset + count), -(offset + 1));
    if (bids == null) {
      throw new IllegalStateException("缓存 key [bids] 不存在");
    }

    return bids.stream()
      .map(this::deserialize)
      .toList();
  }

  private void createBid(double amount) {
    Bid bid = new Bid(amount, LocalDateTime.now());

    redisTemplate.opsForList().rightPush("bids", serialize(bid));
  }

  private static String serialize(Bid bid) {
    return bid.amount() + ":" + bid.createdAt().toInstant(ZoneOffset.ofHours(8)).toEpochMilli();
  }

  private Bid deserialize(String bid) {
    String[] bidSeg = bid.split(":");
    return new Bid(
      Double.valueOf(bidSeg[0]),
      Instant.ofEpochMilli(Long.parseLong(bidSeg[1])).atOffset(ZoneOffset.ofHours(8)).toLocalDateTime()
    );
  }
}

record Bid(Double amount, LocalDateTime createdAt) {}