package net.wuxianjie.springbootdemo.redis;

import cn.hutool.core.collection.ListUtil;
import cn.hutool.core.lang.Console;
import cn.hutool.core.util.StrUtil;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.data.redis.connection.StringRedisConnection;
import org.springframework.data.redis.core.RedisCallback;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.query.SortQuery;
import org.springframework.data.redis.core.query.SortQueryBuilder;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class SandBox implements CommandLineRunner {

  public static final String BOOKS_KEY = "books:";

  private final StringRedisTemplate redisTemplate;
  private final ObjectMapper objectMapper;

  @Override
  public void run(String... args) {
    // 模拟查询两个最新评论的书籍
    // 生成测试数据
    List<Book> books = List.of(
      new Book(1L, "OK Book"),
      new Book(3L, "Good Book"),
      new Book(2L, "Bad Book")
    );
    List<Integer> reviewedBookIds = List.of(1, 1, 3, 3, 2, 3, 2);

    // 保存数据至 Redis
    saveBooks(books);
    saveReviews(reviewedBookIds);

    // 从 Redis 中获取最新评论的两本书
    List<Book> newestReviewed = getNewestReviewedBook(2);
    Console.log("最新评论的两本书: {}", newestReviewed);
  }

  private List<Book> getNewestReviewedBook(int count) {
    Long size = redisTemplate.opsForList().size(getBookReviewsKey());
    if (size == null) {
      throw new IllegalStateException(StrUtil.format("缓存 key [] 不存在", getBookReviewsKey()));
    }

    long offset = size - count;
    if (offset < 0) {
      offset = 0;
    }

    SortQuery<String> sortQuery = SortQueryBuilder.sort(getBookReviewsKey())
      .noSort()
      .limit(offset, count)
      .get("#")
      .get(BOOKS_KEY + "*->name")
      .build();

    List<Book> books = redisTemplate.sort(sortQuery, tuple -> {
      Long bookId = Long.valueOf(tuple.get(0));
      String bookName = tuple.get(1);
      return new Book(bookId, bookName);
    });

    return ListUtil.reverse(books);
  }

  private void saveReviews(List<Integer> reviewedBookIds) {
    String[] bookIds = reviewedBookIds.stream().map(String::valueOf).toArray(String[]::new);

    redisTemplate.opsForList().rightPushAll(getBookReviewsKey(), bookIds);
  }

  private void saveBooks(List<Book> books) {
    redisTemplate.executePipelined((RedisCallback<?>) connection -> {
      StringRedisConnection conn = (StringRedisConnection) connection;

      books.forEach(book -> {
        Map<String, String> data = objectMapper.convertValue(book, new TypeReference<>() {});
        data.remove("id");

        conn.hMSet(getBooksKey(book.id()), data);
      });

      return null;
    });
  }

  private String getBooksKey(long bookId) {
    return BOOKS_KEY + bookId;
  }

  private String getBookReviewsKey() {
    return "books:reviews";
  }
}

record Book(Long id, String name) {}