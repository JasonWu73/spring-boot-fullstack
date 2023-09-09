package net.wuxianjie.springbootdemo.redis;

import cn.hutool.core.lang.Console;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.script.DefaultRedisScript;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class SandBox implements CommandLineRunner {

  private final StringRedisTemplate redisTemplate;

  @Override
  public void run(String... args) {
    // 运行 LUA 脚本
    DefaultRedisScript<Long> script = new DefaultRedisScript<>();
    script.setScriptText("""
      local key = KEYS[1]
      local num = tonumber(ARGV[1])
            
      local val = redis.call('GET', key)
      val = tonumber(val)
      if val == nil then
        val = 0
      end
            
      val = val + num
      redis.call('SET', key, val)
      return val""");
    script.setResultType(Long.class);

    Long result = redisTemplate.execute(script, List.of("books:count"), "10");
    System.out.printf("Result: %s%n", result);
  }
}