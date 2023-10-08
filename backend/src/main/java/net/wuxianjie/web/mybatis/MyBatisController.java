package net.wuxianjie.web.mybatis;

import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import net.wuxianjie.web.mybatis.dto.MyBatisData;
import net.wuxianjie.web.mybatis.dto.MyBatisType;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
  public MyBatisData addData(@RequestBody @Valid final MyBatisData data) {
    data.setType(MyBatisType.TYPE_2);

    myBatisMapper.insertData(data);

    return data;
  }
}
