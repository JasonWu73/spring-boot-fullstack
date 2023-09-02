package net.wuxianjie.springbootdemo.redis;

import cn.hutool.core.util.IdUtil;
import cn.hutool.core.util.StrUtil;

public class KeyUtils {

  public static String getUuid() {
    return IdUtil.fastSimpleUUID();
  }

  public static String getUsers(String userId) {
    return StrUtil.format("users:{}", userId);
  }

  public static String getSessions(String sessionId) {
    return StrUtil.format("sessions:{}", sessionId);
  }
}
