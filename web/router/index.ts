import { createRouter, createWebHistory } from 'vue-router'
const Warehouse = () => import('@/pages/Warehouse.vue')
const Action = () => import('@/pages/Action.vue')
const History = () => import('@/pages/History.vue')
const Login = () => import('@/pages/Login.vue')
const Print = () => import('@/pages/Print.vue')
const CustomPrinting = () => import('@/pages/CustomPrinting.vue')

const routes = [
  { path: '/', component: CustomPrinting },
  { path: '/warehouse', component: Warehouse },
  { path: '/action', component: Action },
  { path: '/history', component: History },
  { path: '/login', component: Login },
  { path: '/print', component: Print }
]
const router = createRouter({
  // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
  // history: createWebHashHistory(),
  history: createWebHistory(),
  routes, // `routes: routes` 的缩写
})


// router.beforeEach((to: any, from) => {
//   // const cookiesString = document.cookie
//   // const cookiesArray = cookiesString.split(';')
//   // const cookiesObj = (() => {
//   //   const obj: {
//   //     [key: string]: any;
//   //   } = {}
//   //   cookiesArray.forEach(val => {
//   //     const arr = val.split('=')
//   //     obj[arr[0]] = arr[1]
//   //   })
//   //   return obj
//   // })()

//   // cookiesObj.token
  
  
//   return true
// })


export default router