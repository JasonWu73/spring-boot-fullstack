package net.wuxianjie.web.user;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserMapper {

  User selectByUsername(String username);
}
