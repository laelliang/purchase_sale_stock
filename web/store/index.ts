import { createStore } from 'vuex'

import { getAllProducts } from '@/api/index'

// 创建一个新的 store 实例
const store = createStore({
  state () {
    return {
      products: [],
      document: {}
    }
  },
  mutations: {
    setProducts(state: any, data: any[]) {
      state.products = data
    },
    setDocument(state: any, data: any) {
      state.document = data
    },
  },
  actions: {
    async getProducts(context: any) {
      const res = await getAllProducts()
      context.commit('setProducts', res.data)
    },
  }
})

// 在 Vuex Store 中监听状态变化
store.subscribe((_, state) => {
  // 将状态数据存储到 LocalStorage 中
  localStorage.setItem('vuexState', JSON.stringify(state));
});

// 在应用启动时从 LocalStorage 中读取数据
const vuexState = localStorage.getItem('vuexState');
if (vuexState) {
  store.replaceState(JSON.parse(vuexState));
}

export default store