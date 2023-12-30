import { createApp } from 'vue'
import router from '@router/index'
import main from './main.vue'
import store from '@store/index'
import 'vant/lib/index.css'

createApp(main).use(router).use(store).mount('#app')