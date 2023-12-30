import router from '@/api/index'
import routerInterception from '@/middlewares/routerInterception'
import config from '@/config'
const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const app = new Koa()

app.use(routerInterception)
app.use(bodyParser())
app.use(router.routes())
app.listen(config.port)
console.log(config)