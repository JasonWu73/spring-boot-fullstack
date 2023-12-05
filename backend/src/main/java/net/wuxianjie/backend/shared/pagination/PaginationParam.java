package net.wuxianjie.backend.shared.pagination;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Pattern;
import lombok.AccessLevel;
import lombok.Data;
import lombok.Setter;
import net.wuxianjie.backend.shared.validator.EnumValidator;

/**
 * 分页查询参数。
 **/
@Data
public class PaginationParam {

  /**
   * 页码。
   */
  @Min(value = 1, message = "页码不能小于 1")
  private int pageNum;

  /**
   * 每页条数。
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
  private String sortColumn;

  /**
   * 排序方式，只能是 {@code asc} 或 {@code desc}。
   */
  @EnumValidator(value = SortOrder.class, message = "排序方式只能是 asc 或 desc")
  private String sortOrder;

  /**
   * 由程序自动设置偏移量参数，详见 {@link PaginationOffsetAspect}。
   */
  public void setOffset() {
    setOffset((pageNum - 1) * pageSize);
  }
}
