<template>
  <div class="list">
    <div class="sidebar">
      <div
        v-for="val in productsGroupedKey"
        :key="val"
        :class="{'nav-active-item': (navActive || defaultNavActive) === val }"
        @click="navActive = val"
      >
        {{ val }}
      </div>
    </div>
    <div class="list-item-container">
      <div class="products-list-item" v-for="val in activeData" :key="val.id">
        <span class="name">{{ val.name }}</span>
        <span class="specification">{{ val.specification }}</span>

        <div class="row">
          <span class="price">&yen;{{ val.price || 0 }}元/{{ val.unit }}</span>
          <span class="quantity">库存：{{ val.quantity }}{{ val.unit }}</span>
        </div>
        <span class="btn" @click="addBtnClick(val)">添加</span>
      </div>
    </div>
  </div>
  <div class="inventory">
    <div class="total-price" v-if="inventory.length > 0">
      <span>总价：&yen;{{ totalPrice }}</span>
    </div>
    <div class="inventory-item" v-for="val in inventory">
      <div class="product-info">
        {{val.name}}/{{ val.specification }}/{{ val.price || 0 }}元/{{ val.unit }}
      </div>
      <van-stepper @change="stepperChange" class="stepper" v-model="val.purchase_quantity" min="0"/>
    </div>
    <div class="customer">
      <van-field v-model="customer" required label="客户名" placeholder="请输入客户名" />
    </div>
    <div class="action-bar">
      <div class="radio-group-btn">
        <span
          class="btn"
          :class="{ 'radio-group-active': (activeAction || defaultActiveAction) === 'stock-in' }"
          @click="activeAction = 'stock-in'"
        >入库</span>
        <span
          class="btn"
          :class="{ 'radio-group-active': (activeAction || defaultActiveAction) === 'stock-out' }"
          @click="activeAction = 'stock-out'"
        >出库</span>
      </div>
      <span class="btn" @click="confirm">确定</span>
    </div>
  </div>
  <bottom-nav />
</template>

<!-- CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '商品id',
    name VARCHAR(100) COMMENT '商品名称',
    unit VARCHAR(100) COMMENT '计量单位',
    specification VARCHAR(3000) COMMENT '商品规格',
    weight DECIMAL(10, 2) COMMENT '商品重量（kg）',
    price DECIMAL(10, 2) COMMENT '商品价格（元）',
    quantity INT UNSIGNED COMMENT '库存数量'
) COMMENT '商品表'; -->

<script setup lang="ts">
import { ref, computed } from 'vue'
import { showFailToast } from 'vant'
import { useStore } from 'vuex'
import { addDocument } from '@/api/index'
import BottomNav from '@/components/BottomNav.vue'
import router from '@router/index'
import 'vant/es/toast/style'

const store = useStore()
const defaultActiveAction = 'stock-out'
const activeAction = ref('')

const inventory = ref<any>([])
const addBtnClick = (data: any) => {
  if (inventory.value.length > 8) {
    showFailToast('最多添加8项商品')
    return
  }
  const item = inventory.value.find((val:any) => val.id === data.id)
  if (item) {
    data['purchase_quantity'] ++
  } else {
    data['purchase_quantity'] = 1
    inventory.value.push(data)
  }
}

const totalPrice = computed(() => {
  let totalizer = 0
  inventory.value.forEach((val: any) => {
    totalizer += val.purchase_quantity * val.price
  })
  return totalizer
})
const productsData = computed(() => store.state.products)
const productsGroupedKey = computed(() => store.state.products?.reduce((arr: any, val: any) => {
    const i = arr.findIndex((item: string) => item === val.name)
    if (i < 0) {
      arr.push(val.name)
    }
    return arr
  }, []))

const customer = ref('')
const getProducts = async () => {
  await store.dispatch('getProducts')
}

getProducts()

const confirm = () => {
  if (!customer.value) {
    showFailToast('请输入客户名')
    return
  }
  if (inventory.value.length === 0) {
    showFailToast('未添加任何商品')
    return
  }
  
  const data = {
    customer_name: customer.value,
    document_type: activeAction.value || defaultActiveAction,
    document_info: inventory.value
  }

  addDocument(data)
  .then((res: any) => {
    store.commit('setDocument', res.data)
    router.push('/print')
  })
}

const stepperChange = (num:number) => {
  if (num === 0) {
    inventory.value = inventory.value.filter((val: any) => val['purchase_quantity'] !== 0)
  } 
}

const navActive = ref('')
const defaultNavActive = computed(() => productsGroupedKey.value[0])

const activeData = computed(() => productsData.value.filter((val: any) => (navActive.value || defaultNavActive.value) === val.name))


</script>

<style scoped lang="scss">
.radio-group-active {
  background-color: #1989fa;
  color: #ffffff!important;
  border-color: #1989fa;
}
.nav-active-item {
  position: relative;
  background-color: #ffffff;
  &::before{
    width: 4px;
    height: 16px;
    background-color: #1989fa;
    content: "";
    position: absolute;
    left: 0;
  }

}


.btn{
  color: #1989fa;
  cursor: pointer;
}
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.list {
  display: flex;
  flex-direction: row;
  flex-grow: 1;
  .list-item-container {
    overflow-y: auto;
    width: calc(100% - 80px);
    .products-list-item {
      display: flex;
      flex-direction: column;
      background-color: #ffffff;
      margin: 10px;
      padding: 10px;
      border-radius: 4px;
      .name {
        font-weight: bold;
        @extend .ellipsis;
      }
      .specification {
        color: #999;
        @extend .ellipsis;
      }
      .quantity {
        align-self: flex-end;
      }
      .row {
        margin-bottom: 10px;
        display: flex;
        justify-content: space-between;
      }
      .btn {
        margin-left: auto;
      }
    }
  }
  .sidebar{
    width: 80px;
    overflow-y: auto;
    &>div{
      display: flex;
      align-items: center;
      justify-content: center;
      height: 60px;
    }
  }

}

.inventory {

  // align-self: end;
  flex-direction: column;
  width: 100%;
  background-color: #ffffff;
  .total-price{
    padding: 10px;
    display: flex;
    justify-content: right;
    align-items: center;

  }
  .inventory-item {
    padding: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .product-info {
      @extend .ellipsis;
    }
    .stepper {
      white-space: nowrap;
    }
  }
  .action-bar {
    align-self:end;
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 20px;
    .radio-group-btn {
      &>span {
        border-top: 1px solid rgb(217, 217, 217);
        border-bottom: 1px solid rgb(217, 217, 217);
        padding: 10px;
        display: inline-block;
      }
      &>span:last-child{
        border-right: 1px solid rgb(217, 217, 217);
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
      }
      &>span:first-child{
        border-left: 1px solid rgb(217, 217, 217);
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
      }
      &>span:not(:last-child) {
        border-right: 1px solid rgb(217, 217, 217);
      }
    }
    &>span {
      font-size: 18px;
    }
  }
}
</style>