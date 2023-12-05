package net.wuxianjie.backend.demo.requestparam;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 外部数据。
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OuterData {

  @NotNull(message = "id 不能为 null")
  Long id;

  @NotBlank(message = "名称不能为空")
  String name;

  @Valid
  InnerData inner;
}
