SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for mybatis
-- ----------------------------
DROP TABLE IF EXISTS `mybatis`;
CREATE TABLE `mybatis`
(
    `id`              int unsigned NOT NULL AUTO_INCREMENT,
    `name`            varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `type`            int                                                           DEFAULT NULL,
    `date`            datetime                                                      DEFAULT NULL,
    `local_date_time` datetime                                                      DEFAULT NULL,
    `local_date`      date                                                          DEFAULT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
