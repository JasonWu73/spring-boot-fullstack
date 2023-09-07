package net.wuxianjie.springbootdemo.redis;

import cn.hutool.core.lang.Console;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.data.redis.connection.DefaultStringTuple;
import org.springframework.data.redis.connection.SortParameters;
import org.springframework.data.redis.connection.StringRedisConnection;
import org.springframework.data.redis.core.RedisCallback;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.query.SortQuery;
import org.springframework.data.redis.core.query.SortQueryBuilder;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class SandBox implements CommandLineRunner {

  public static final String BOOKS_KEY = "books:";

  private final StringRedisTemplate redisTemplate;
  private final ObjectMapper objectMapper;

  @Override
  public void run(String... args) {
    // 模拟获取最高查看数的书籍
    // 生成测试数据
    List<Book> books = List.of(
      new Book(1L, "Java", 10),
      new Book(2L, "JavaScript", 20),
      new Book(3L, "C++", 2)
    );

    // 存入测试数据
    saveToRedis(books);

    // 获取查看数最高的两书籍
    List<Book> highestBooks = getHighestBooks(2);
    Console.log("最高查看数的两本书为: {}", highestBooks);
  }

  private List<Book> getHighestBooks(int count) {
    SortQuery<String> sortQuery = SortQueryBuilder
      .sort(getBooksByViewsKey())
      .noSort()
      .get("#")
      .get(BOOKS_KEY + "*->name")
      .get(BOOKS_KEY + "*->views")
      .limit(0, count)
      .order(SortParameters.Order.DESC)
      .build();

    return redisTemplate.sort(sortQuery, tuple -> {
      String bookId = tuple.get(0);
      String bookName = tuple.get(1);
      String bookViews = tuple.get(2);
      return new Book(Long.parseLong(bookId), bookName, Integer.parseInt(bookViews));
    });
  }

  private void saveToRedis(List<Book> books) {
    redisTemplate.executePipelined((RedisCallback<?>) connection -> {
      StringRedisConnection conn = (StringRedisConnection) connection;

      books.forEach(book -> {
        saveBooks(conn, book);

        saveBookViews(conn, books);
      });

      return null;
    });
  }

  private void saveBookViews(StringRedisConnection conn, List<Book> books) {
    Set<StringRedisConnection.StringTuple> tuples = convertValue(books);

    conn.zAdd(getBooksByViewsKey(), tuples);
  }

  private Set<StringRedisConnection.StringTuple> convertValue(List<Book> books) {
    return books.stream()
      .map(book -> new DefaultStringTuple(book.id() + "", book.views()))
      .collect(Collectors.toSet());
  }

  private void saveBooks(StringRedisConnection conn, Book book) {
    Map<String, String> data = objectMapper.convertValue(book, new TypeReference<>() {});

    conn.hMSet(getBooksKey(book.id()), data);
  }

  private String getBooksKey(long bookId) {
    return BOOKS_KEY + bookId;
  }

  private String getBooksByViewsKey() {
    return "books:views";
  }
}

record Book(Long id, String name, int views) {}