/*
 Navicat Premium Data Transfer

 Source Server         : MySQL-Local
 Source Server Type    : MySQL
 Source Server Version : 80028 (8.0.28)
 Source Host           : localhost:3306
 Source Schema         : demo

 Target Server Type    : MySQL
 Target Server Version : 80028 (8.0.28)
 File Encoding         : 65001

 Date: 29/11/2023 13:46:34
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for mybatis
-- ----------------------------
DROP TABLE IF EXISTS `mybatis`;
CREATE TABLE `mybatis` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type` int DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `local_date_time` datetime DEFAULT NULL,
  `local_date` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for op_log
-- ----------------------------
DROP TABLE IF EXISTS op_log;
CREATE TABLE `op_log` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `requested_at` datetime DEFAULT NULL,
  `client_ip` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `username` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `message` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `remark` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `username` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nickname` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `hashed_password` char(60) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` tinyint DEFAULT NULL,
  `authorities` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of user
-- ----------------------------
BEGIN;
INSERT INTO `user` (`id`, `created_at`, `updated_at`, `remark`, `username`, `nickname`, `hashed_password`, `status`, `authorities`) VALUES (1, '2023-11-16 17:28:06', '2023-11-28 22:52:08', NULL, 'su', '超级管理员', '$2a$10$P5hzKCPYd6BC0TGLkmFV3uab.i74EMuqteT/evJshr0n2vg5ly/PK', 1, 'root');
INSERT INTO `user` (`id`, `created_at`, `updated_at`, `remark`, `username`, `nickname`, `hashed_password`, `status`, `authorities`) VALUES (2, '2023-11-16 17:28:35', '2023-11-28 16:59:24', NULL, 'admin', '管理员', '$2a$10$GkiaNMc8nEvLDMrxaTWlQ.eJUO/DPYXuAqvja25Dz8e89ED7Q4602', 1, 'admin');
INSERT INTO `user` (`id`, `created_at`, `updated_at`, `remark`, `username`, `nickname`, `hashed_password`, `status`, `authorities`) VALUES (3, '2023-11-16 17:28:56', '2023-11-20 20:18:26', NULL, 'user', '普通用户', '$2a$10$GgtExOSVvC5MWO5Eb1UuP.QKsKLe2Mrx1BOT7AddllePbCeiNJpTW', 1, 'user');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
