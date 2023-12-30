import { secretKey } from "@/token"
import config from '@/config'

const mysql = require('mysql2')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

// 创建连接池
const pool = mysql.createPool({
  host: config.mysql.host,
  user: config.mysql.user,
  port: config.mysql.port,
  password: config.mysql.password,
  database: config.mysql.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})

const promisePool = pool.promise()

// 查询Products表所有数据
export const getAllProducts = async () => {
  const sql = 'SELECT * FROM products'
  const [results] = await promisePool.query(sql)
  return results
}

// 删除表数据
// export const deleteTable = async (tableName: String) => {
//   const sql = `DELETE FROM ${tableName}`
//   const [results] = await promisePool.query(sql)
//   return results
// }

// 导入数据
export const importCsvData = async (dataArr: any[]) => {
  const sql1 = `DELETE FROM products`
  await promisePool.query(sql1)

  const sql = 'INSERT INTO products (name, unit, specification, weight, price, quantity) VALUES ?'
  const params = dataArr.map(data => {
    const { name, unit, specification, weight, price, quantity } = data
    return [name, unit, specification, weight, price, quantity]
  })
  
  const [results] = await promisePool.query(sql, [params])
  return results
}

// 添加单据
export const addDocument = async (document: any, user: any) => {
  const { customer_name, document_type, document_info } = document

  const operator = (() => {
    if (document_type === 'stock-in') {
      return '+'
    } else if (document_type === 'stock-out') {
      return '-'
    }
  })()
  document_info.forEach(async (val: any) => {
    const sql = `UPDATE products SET quantity = quantity ${ operator } ? WHERE id = ?`
    await promisePool.execute(sql, [val.purchase_quantity, val.id])
  })

  // 查询客户
  const sql1 = 'SELECT * FROM customers where customer_name = ?'
  const [rows1] = await promisePool.execute(sql1, [customer_name])
  let customer_id = undefined
  let phone_number = undefined


  // 客户存在
  if (rows1.length > 0) {
    customer_id = rows1[0].id
    phone_number = rows1[0].phone_number
    // 客户不存在
  } else {
    const sql2 = 'INSERT INTO customers ( customer_name ) VALUES (?)'
    const [result] = await promisePool.execute(sql2, [customer_name])
    if (result.length > 0) {
      customer_id = result.insertId
    }
  }

  const create_date = new Date().toISOString().slice(0, 19).replace('T', ' ')
  // 单据存储
  const sql4 = 'INSERT INTO documents ( create_date, user_id, customer_id, document_type, document_info ) VALUES (?,?,?,?,?)'
  const [result] = await promisePool.execute(sql4, [
    create_date, user.user_id, customer_id, document_type, JSON.stringify(document_info)
  ])

  if (result) {
    const dataObj = {
      document_id: result.insertId,
      document_type,
      customer_name: customer_name,
      user_name: user.user_name,
      phone_number,
      create_date,
      document_info
    }
  
    return dataObj
  }
}

// 分页查询
export const getUserDocuments = async (user: any, data: any) => {
  const { page_number, page_size } = data

  const countSql = 'SELECT COUNT(*) AS total FROM documents WHERE user_id = ?'
  const [countRows] = await promisePool.execute(countSql, [user.user_id])
  const totalRecords = countRows[0].total

  const sql1 = `SELECT documents.id AS document_id,
  documents.document_type,
  documents.document_info,
  customers.customer_name,
  customers.phone_number,
  users.user_name,
  DATE_FORMAT(documents.create_date, "%Y-%m-%d %H:%i:%s") AS create_date
FROM
    documents
INNER JOIN
    customers ON documents.customer_id = customers.id
INNER JOIN
    users ON documents.user_id = users.id
WHERE
    documents.user_id = ?
ORDER BY
    documents.id DESC
LIMIT ?, ?`

  const [rows] = await promisePool.execute(sql1, [user.user_id, String((page_number - 1) * page_size), String(page_size)])
  return {
    total_records: totalRecords,
    page_number,
    page_size,
    data: rows
  }
}

// 查询所有模板
export const getTemplates = async () => {
  const sql = 'SELECT * FROM templates'
  const [results] = await promisePool.query(sql)
  return results
}
// 登录
export const login = async (data: any) => {
  const sql = 'SELECT * FROM users where user_name = ?'
  const [results] = await promisePool.execute(sql, [data.user_name])

  let token = undefined
  if (results.length > 0) {
    const salt = results[0].salt
    const encrypted_password = results[0].encrypted_password

    const saltedPassword = data.password + salt
    const hash = crypto.createHash('sha256')
    hash.update(saltedPassword)
    const hashedPassword = hash.digest('hex').toUpperCase()
    
    if (encrypted_password === hashedPassword) {
      token = jwt.sign({
        user_name: data.user_name,
        password: data.password,
        user_id: results[0].id
      }, secretKey, { expiresIn: '3d' })
    }
  }
  const salt = crypto.randomBytes(16).toString('hex'); // 16字节的盐值
  return token
}

// export const getProduct = async (id: number) => {
//   const sql = 'SELECT * FROM products WHERE id == ?'
//   const params = [id]
//   await fnTemplate(sql, params)
// }
