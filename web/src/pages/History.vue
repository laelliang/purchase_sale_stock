<template>
  <div class="history-page">
    <van-pull-refresh class="history-body" v-model="loading" @refresh="onRefresh">
      <div class="list-container">
        <div class="document" v-for="val in documentsList">
          <div class="document-header">
            <span class="ellipsis">
              <span>{{ typeMap.get(val.document_type) }}</span>
              /
              <span>{{ val.customer_name }}</span>
            </span>
            <span class="no-wrap">总价{{ getTotalPrice(val.document_info) }}元</span>
          </div>
          <div class="document-body">
            <div v-for="item in val.document_info">
              <span class="ellipsis">
                {{item.name}}/{{ item.specification }}/{{ item.price || 0 }}元/{{ item.unit }}
              </span>
              <span class="no-wrap">{{item.purchase_quantity}}{{ item.unit }}/{{ item.purchase_quantity * item.price || 0 }}元</span>
            </div>
          </div>
          <div class="document-footer">
            <span class="create-date ellipsis">{{ val.create_date }}</span>
            <span class="btn no-wrap" @click="printBtnClick(val)">打印</span>
          </div>
        </div>
      </div>
    </van-pull-refresh>
  </div>
  <van-pagination v-model="pageNumber" :total-items="totalRecords" :show-page-size="pageSize" @change="paginationChange">
    <template #prev-text>
      <van-icon name="arrow-left" />
    </template>
    <template #next-text>
      <van-icon name="arrow" />
    </template>
    <template #page="{ text }">{{ text }}</template>
  </van-pagination>
  <bottom-nav />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BottomNav from '@/components/BottomNav.vue'
import { getUserActionHistory } from '@/api'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
const store = useStore()
const router = useRouter()
const pageNumber = ref(1)
const pageSize = ref(20)
const documentsList = ref<any[]>([])
const totalRecords = ref(0)
const loading = ref(false)
const getUserDocuments = async () => {
  getUserActionHistory({
    page_number: pageNumber.value,
    page_size: pageSize.value
  }).then((res: any) => {
    totalRecords.value = res.data.total_records
    pageNumber.value = res.data.page_number
    pageSize.value = res.data.page_size
    documentsList.value = res.data.data
  })
}

const paginationChange = (num: any) => {
  pageNumber.value = num
  getUserDocuments()
}

const printBtnClick = (document: any) => {
  store.commit('setDocument', document)
  router.push('/print')
}

const typeMap = new Map()
typeMap.set("stock-in", "入库")
typeMap.set("stock-out", "出库")

getUserDocuments()
const onRefresh = async () => {
  await getUserDocuments()
  loading.value = false
}

const getTotalPrice = (arr: Array<any>) => {
  let totalPrice = 0
  arr.forEach(val => {
    totalPrice += val.purchase_quantity * val.price
  })
  return totalPrice
}


</script>
<style scoped lang="scss">

.no-wrap {
  white-space: nowrap;
}
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.history-page {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  .history-body {
    flex-grow: 1;
    .list-container {
      height: 100%;
      overflow-y: auto;
    }
  }
  .document {
    margin: 10px;
    padding: 10px;
    border-radius: 4px;
    background-color: #fff;

    .document-header,.document-footer,.document-body>div {
      display: flex;
      justify-content: space-between;
    }
    .document-header {
      font-weight: bold;
      margin-bottom: 4px;
    }
    .document-footer {
      margin-top: 4px;
      align-items: center;
      .create-date {
        font-weight: bold;
      }
      .btn {
        @extend .btn;
      }
    }
  }
}

</style>