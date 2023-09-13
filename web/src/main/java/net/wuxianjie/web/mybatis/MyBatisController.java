package net.wuxianjie.web.mybatis;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import net.wuxianjie.web.demo.dto.DemoData;
import net.wuxianjie.web.mybatis.dto.MyBatisData;
import net.wuxianjie.web.mybatis.dto.MyBatisType;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Validated
@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class MyBatisController {

  private final MyBatisMapper myBatisMapper;

  @GetMapping("/mybatis")
  public List<MyBatisData> getAllData() {
    return myBatisMapper.selectAllData();
  }

  @PostMapping("/mybatis")
  public MyBatisData addData(@RequestBody @Valid MyBatisData data) {
    data.setType(MyBatisType.TYPE_2);

    myBatisMapper.insertData(data);

    return data;
  }
}