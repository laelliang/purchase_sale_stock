import { secretKey } from '@/token'
const jwt = require('jsonwebtoken')

const routerInterception = async (ctx: any, next: any) => {
  // const cookie = (() => {
  //   const obj: {
  //     [key: string]: any;
  //   } = {}
  //   const str = ctx.request.header.cookie
  //   if (str) {
  //     str.split(';').forEach((val: string) => {
  //       const arr = val.split('=')
  //       obj[arr[0]] = arr[1]
  //     })
  //   }
  //   return obj
  // })()

  await next()
  // const token = cookie.token
  // const isLogin = ctx.request.url !== '/login'
  // if (!token && isLogin) {
  //   ctx.body = {
  //     code: 302,
  //     msg: '未登录，请登录'
  //   }
  // } else if (isLogin) {
  //   const data = jwt.verify(token,secretKey)
  //   if (data.iat > data.exp) {
  //     ctx.body = {
  //       code: 302,
  //       msg: 'token已过期，请重新登录'
  //     }
  //   } else {
  //     ctx.user = data
  //     await next()
  //   }
  // } else {
  //   await next()
  // }
}

export default routerInterception