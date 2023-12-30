function genValidateParams (method: string, schema: any) {
  async function validateParams (ctx: any, next: any) {
    let data: any
    if (method === 'get') {
      data = ctx.request.query
    } else {
      data = ctx.request.body
    }
    const { error } = schema.validate(data)
    if (error) {
      ctx.body = {
        code: 400,
        msg: error.message
      }
      return
    }
    await next()
  }
  return validateParams
}

export default genValidateParams
