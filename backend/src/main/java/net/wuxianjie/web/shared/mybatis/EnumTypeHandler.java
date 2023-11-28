package net.wuxianjie.web.shared.mybatis;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.apache.ibatis.type.BaseTypeHandler;
import org.apache.ibatis.type.JdbcType;
import org.springframework.stereotype.Component;

import java.sql.CallableStatement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Arrays;
import java.util.Optional;

/**
 * 枚举类型与数据库 int 类型的类型转换器。
 */
@Component
@NoArgsConstructor
@AllArgsConstructor
public class EnumTypeHandler<T extends Enum<?> & EnumType>
    extends BaseTypeHandler<EnumType> {

  private Class<T> enumType;

  @Override
  public void setNonNullParameter(
      final PreparedStatement ps,
      final int i,
      final EnumType parameter,
      final JdbcType jdbcType
  ) throws SQLException {
    ps.setInt(i, parameter.getCode());
  }

  @Override
  public EnumType getNullableResult(
      final ResultSet rs,
      final String columnName
  ) throws SQLException {
    return toEnum(enumType, rs.getInt(columnName));
  }

  @Override
  public EnumType getNullableResult(final ResultSet rs, final int columnIndex)
      throws SQLException {
    return toEnum(enumType, rs.getInt(columnIndex));
  }

  @Override
  public EnumType getNullableResult(
      final CallableStatement cs,
      final int columnIndex
  ) throws SQLException {
    return toEnum(enumType, cs.getInt(columnIndex));
  }

  private T toEnum(final Class<T> enumClass, final int value) {
    return Optional
        .ofNullable(enumClass.getEnumConstants())
        .flatMap(enums -> Arrays.stream(enums)
            .filter(theEnum -> theEnum.getCode() == value)
            .findFirst()
        )
        .orElse(null);
  }
}
