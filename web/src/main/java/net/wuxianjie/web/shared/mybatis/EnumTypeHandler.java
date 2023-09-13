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
public class EnumTypeHandler<E extends Enum<?> & EnumType> extends BaseTypeHandler<EnumType> {

  private Class<E> enumType;

  @Override
  public void setNonNullParameter(PreparedStatement ps, int i, EnumType parameter, JdbcType jdbcType) throws SQLException {
    ps.setInt(i, parameter.getCode());
  }

  @Override
  public EnumType getNullableResult(ResultSet rs, String columnName) throws SQLException {
    return toEnum(enumType, rs.getInt(columnName));
  }

  @Override
  public EnumType getNullableResult(ResultSet rs, int columnIndex) throws SQLException {
    return toEnum(enumType, rs.getInt(columnIndex));
  }

  @Override
  public EnumType getNullableResult(CallableStatement cs, int columnIndex) throws SQLException {
    return toEnum(enumType, cs.getInt(columnIndex));
  }

  private E toEnum(Class<E> enumClass, int value) {
    return Optional.ofNullable(enumClass.getEnumConstants())
      .flatMap(enums -> Arrays.stream(enums)
        .filter(e -> e.getCode() == value)
        .findFirst()
      )
      .orElse(null);
  }
}
