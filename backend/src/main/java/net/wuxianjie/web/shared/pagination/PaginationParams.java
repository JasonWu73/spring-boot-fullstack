package net.wuxianjie.web.shared.pagination;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Pattern;
import lombok.*;
import net.wuxianjie.web.shared.validator.EnumValidator;

/**
 * 分页查询参数。
 **/
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaginationParams {

  /**
   * 页码，必填，值 >= 1。
   */
  @Min(value = 1, message = "页码不能小于 1")
  private int pageNum;

  /**
   * 每页条数，必填，值 >= 1。
   */
  @Min(value = 1, message = "每页显示条目个数不能小于 1")
  private int pageSize;

  /**
   * MySQL、SQLite 等数据库的偏移量 OFFSET，例如：
   *
   * <ul>
   *   <li>{@code SELECT * FROM table_name LIMIT #{pageSize} OFFSET #{offset}}</li>
   *   <li>{@code SELECT * FROM table_name LIMIT #{offset}, #{pageSize}}</li>
   * </ul>
   */
  @Setter(AccessLevel.PRIVATE)
  private int offset;

  /**
   * 排序的列名。
   */
  @Pattern(regexp = "^[a-zA-Z0-9_]+$", message = "排序的列名只能包含字母、数字和下划线")
  private String orderBy;

  /**
   * 排序方式，可选值：{@code asc}、{@code desc}。
   */
  @EnumValidator(value = OrderBy.class, message = "排序方式只能是 asc 或 desc")
  private String order;

  /**
   * 由程序自动设置偏移量参数，详见 {@link PaginationOffsetAspect}。
   */
  public void setOffset() {
    setOffset((pageNum - 1) * pageSize);
  }
}
