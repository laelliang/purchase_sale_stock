<template>
  <div class="home-header">
    <div class="btn" @click="importCSV">csv导入</div>
    <div class="btn" @click="exportCSV">csv导出</div>
  </div>
  <van-pull-refresh class="home-body" v-model="loading" @refresh="onRefresh">
    <div class="list-container">
      <div class="product" v-for="val in productsGroupedData">
        <span class="product-name">{{ val[0].name }}</span>
        <min-table :data-arr="getMinTableData(val)" :header-arr="minTableHeaderArr" />
      </div>
    </div>
  </van-pull-refresh>
  <bottom-nav />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import BottomNav from '@/components/BottomNav.vue'
import { importProductsFromCSV } from '@/api/index'
import { selectCSVFile, arrToCSV, groupArray } from '@/utils/index'
import { showFailToast, showSuccessToast } from 'vant'
import type { StringKeyObject, Products } from '@/types/index'
import MinTable from '@/components/MinTable.vue'
import 'vant/es/toast/style'

import { useStore } from 'vuex'
const store = useStore()


const productsMap: StringKeyObject = {
  // id: {
  //   name: '商品id',
  //   type: 'string'
  // },
  name: {
    name: '商品名称',
    type: 'string'
  },
  specification: {
    name: '商品规格',
    type: 'string'
  },
  weight: {
    name: '商品重量（kg）',
    type: 'float'
  },
  unit: {
    name: '计量单位',
    type: 'string'
  },
  price: {
    name: '商品价格（元）',
    type: 'float'
  },
  quantity: {
    name: '库存数量',
    type: 'int'
  }
}
const loading = ref(false)
const minTableHeaderArr = [
  { name: '商品规格', key: 'specification' },
  { name: '商品重量', key: 'weight' },
  { name: '商品价格', key: 'price' },
  { name: '库存数量', key: 'quantity' }
]

const getMinTableData = (arr: Products[]) => {
  return arr.map(val => ({
    specification: val.specification,
    weight: val.weight + 'kg',
    price: val.price + '元',
    quantity: val.quantity + val.unit
  }))
}

const productsGroupedData = computed(() => groupArray(store.state.products, 'name') as Products[][])

const getProducts = async () => {
  await store.dispatch('getProducts')
}

getProducts()

const onRefresh = async () => {
  await getProducts()
  loading.value = false
}


const importCSV = () => {
  selectCSVFile()
  .then(text => {
    const arr = text.split('\n').map(val => val.trim()).filter(val => val)
    if (arr.length >= 2) {
      const keys = Object.keys(productsMap)
      const header = arr.shift()?.split(',').map(val => {
        for (const key of keys) {
          if (productsMap[key].name === val) {
            return key
          }
        }
      })
      const data = arr.map(val => {
        const obj: StringKeyObject = {}
        val.split(',').forEach((item, i) => {
          const key = header?.[i]
          if (key) {
            obj[key] = (() => {
              if (productsMap[key].type === 'float') {
                return parseFloat(item)
              } else if (productsMap[key].type === 'int') {
                return parseInt(item)
              } else {
                return item
              }
            })()
          }
        })
        return obj
      })
      importProductsFromCSV(data)
      .then(() => {
        showSuccessToast('导入成功')
        getProducts()
      })
    } else {
      showFailToast('格式错误或无数据')
    }
  })
  .catch((err: Error) => {
    showFailToast(err.message)
  })
}

const exportCSV = async () => {
  await getProducts()
  const products = store.state.products
  const keys = Object.keys(productsMap)
  const header = keys.map(key => productsMap[key].name)
  const dataArr = products.map((val: any) => {
    return keys.map(key => val[key])
  })
  arrToCSV(header, dataArr)
}


</script>

<style scoped lang="scss">
.home-header {
  display: flex;
  justify-content: space-around;
  background-color: #ffffff;
  .btn {
    display: inline-block;
    padding: 20px;
  }
}

.home-body {
  flex-grow: 1;
  background-color: #f7f8fa;
  overflow-y: auto;
  .list-container {
    height: 100%;
    overflow-y: auto;
  }
}

.product {
  margin: 10px;
  border-radius: 4px;
  background-color: #FFFFFF;
  padding: 10px;
  .product-name{
    font-size: 24px;
    margin-bottom: 20px;
  }
  
}

</style>