const Joi = require('joi')

// 商品Schema
export const productSchema = Joi.object({
  data: Joi.array().items(
    Joi.object({
      name: Joi.string().max(25).required(),
      unit: Joi.string().max(25).required(),
      specification: Joi.string().max(750).required(),
      weight: Joi.number().min(0).max(500).required(),
      price: Joi.number().min(0).max(2500).required(),
      quantity: Joi.number().min(0).max(2500).required()
    })
  )
})

// 单据Schema
export const documentSchema = Joi.object({
  customer_name: Joi.string().required(),
  document_type: Joi.string().valid('stock-in','stock-out','stores-list').required(),
  document_info:Joi.array().items(
    Joi.object({
      id: Joi.number().min(0),
      name: Joi.string().max(25).required(),
      unit: Joi.string().max(25).required(),
      specification: Joi.string().max(750).required(),
      weight: Joi.number().min(0).max(500).required(),
      price: Joi.number().min(0).max(2500).required(),
      quantity: Joi.number().min(0).max(2500).required(),
      purchase_quantity: Joi.number().min(0).required()
    })
  )
})

// 客户Schema
export const customerSchema = Joi.object({
  customer_name: Joi.string().required().max(25),
  phone_number: Joi.string().regex(/^1\d{9}$/)
})

// userSchema
export const userSchema = Joi.object({
  user_name: Joi.string().required().max(25),
  password: Joi.string().required().min(6).max(25)
})

export const htmlParamsSchema = Joi.object({
  html: Joi.string().required().max(16380),
  width: Joi.string().required().max(25),
  height: Joi.string().required().max(25),
})

export const pagingQuerySchema = Joi.object({
  page_number: Joi.number().required().min(1).max(10000),
  page_size: Joi.number().required().min(1).max(100)
})
