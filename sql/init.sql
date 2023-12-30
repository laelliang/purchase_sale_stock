CREATE DATABASE pstdb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

use pstdb;

CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '商品id',
    name VARCHAR(100) COMMENT '商品名称',
    unit VARCHAR(100) COMMENT '计量单位',
    specification VARCHAR(3000) COMMENT '商品规格',
    weight DECIMAL(10, 2) COMMENT '商品重量（kg）',
    price DECIMAL(10, 2) COMMENT '商品价格（元）',
    quantity INT UNSIGNED COMMENT '库存数量'
) COMMENT '商品表';


CREATE TABLE documents (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '单据id',
    create_date DATETIME COMMENT '创建时间',
    user_id INT COMMENT '用户id',
    customer_id Int COMMENT '客户id',
    document_type ENUM('stock-in','stock-out','stores-list') COMMENT '单据类型（入库单、出库单、库存单）',
    document_info JSON COMMENT '单据信息'
) COMMENT '单据表';


CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '用户id',
    user_name VARCHAR(100) NOT NULL COMMENT '用户名',
    salt VARCHAR(100) NOT NULL COMMENT '盐',
    encrypted_password VARCHAR(100) NOT NULL COMMENT '加密后的密码'
) COMMENT '用户表';

CREATE TABLE customers (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '客户id',
    customer_name VARCHAR(100) NOT NULL COMMENT '客户名',
    phone_number VARCHAR(20) COMMENT '客户手机号'
) COMMENT '客户表';


CREATE TABLE templates (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '模板id',
    template_name VARCHAR(100) NOT NULL COMMENT '模板名',
    template_string TEXT COMMENT '模板字符串',
    template_width VARCHAR(100) COMMENT '模板宽度',
    template_height VARCHAR(100) COMMENT '模板高度'
) COMMENT '模板表';





