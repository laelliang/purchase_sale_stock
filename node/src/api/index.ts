const Router = require('koa-router');
const router = new Router();
import * as sql from '@/mysql/index'
import validateParams from '@/middlewares/validateParams'
import { productSchema, documentSchema, userSchema, htmlParamsSchema, pagingQuerySchema } from '@/validator/index'
import { htmlPrint } from '@/utils/index'

// 查询所有商品
router.get("/getAllProducts" , async (ctx: any, next: any) => {
  const results = await sql.getAllProducts()
  results.forEach((val: any) => {
    val.price = parseFloat(val.price)
    val.weight = parseFloat(val.weight)
  })
  ctx.body = {
    code: 200,
    data: results
  }
})

// csv文件数据导入Products表
router.post("/importProductsFromCSV", validateParams('post', productSchema), async (ctx: any, next: any) => {
  const data = ctx.request.body.data
  const results = await sql.importCsvData(data)
  ctx.body = {
    code: 200,
    data: results
  }
})

// 添加单据
router.post('/addDocument', validateParams('post', documentSchema), async (ctx: any, next: any) => {
  const data = ctx.request.body
  const result = await sql.addDocument(data, ctx.user)
  if (result) {
    ctx.body = {
      code: 200,
      data: result
    }
  } else {
    ctx.body = {
      code: 400,
      msg: '单据添加失败'
    }
  }
})

// 登录
router.post('/login', validateParams('post', userSchema), async (ctx: any, next: any) => {
  const data = ctx.request.body
  const token = await sql.login(data)
  if (token) {
    ctx.cookies.set('token', token, { httpOnly: false, maxAge: 1000 * 60 * 60 * 24 * 3 })
    ctx.body = {
      code: 200,
      msg: '登录成功'
    }
  } else {
    ctx.body = {
      code: 400,
      msg: '用户名或密码错误'
    }
  }
})
// 分页查询用户操作历史
router.post("/getUserActionHistory", validateParams('post', pagingQuerySchema), async (ctx: any, next: any) => {
  const results = await sql.getUserDocuments(ctx.user, ctx.request.body)
  ctx.body = {
    code: 200,
    data: results
  }
})

// 查询用户所有单据
router.get("/getTemplates", async (ctx: any, next: any) => {
  const results = await sql.getTemplates()
  ctx.body = {
    code: 200,
    data: results
  }
})

// 打印
router.post("/htmlToPdf", validateParams('post', htmlParamsSchema), async (ctx: any, next: any) => {
  const pdfPath = await htmlPrint(ctx.request.body)
  if (pdfPath) {
    ctx.body = {
      code: 200,
      data: {
        path: pdfPath
      }
    }
  } else {
    ctx.body = {
      code: 400,
      msg: '转换失败'
    }
  }
})


// products表csv导出
// router.get("/exportProductsToCSV", async (ctx: any, next: any) => {
//   const results = await sql.getAllProducts()
//   ctx.body = {
//     code: 200,
//     data: results
//   }
// })

// 查询所有商品
// router.get("/getAllProducts", async (ctx: any, next: any) => {
//   ctx.checkBody('id').notEmpty().isInt()

//   const err = await ctx.validationErrors();
//   if (err) {
//     ctx.body = {
//       code: 400,
//       msg: 'id需要为数字并且不得为空'
//     }
//   } else {
//     const results = await sql.getAllProducts()
//     ctx.body = {
//       code: 200,
//       data: results
//     }
//   }
// })

// 

export default router;
