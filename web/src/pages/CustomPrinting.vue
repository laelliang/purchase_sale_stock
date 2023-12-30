<template>
  <div class="custom-printing-page">
    <div class="print-preview" ref="">
      <html-img :html-str="htmlStr"></html-img>
    </div>
    <div class="data-list">
      <!-- v-model:active="active" -->
      <van-tabs swipeable shrink  v-model:active="tabActive">
        <van-tab v-for="(val, i) in dataList" :name="i" :title="`编号${i + 1}`">
          <van-field v-model="val.productName" label="商品名称" placeholder="请输入商品名称"/>
          <van-field v-model="val.unit" label="单位" placeholder="请输入单位"/>
          <div class="row">
            <van-field v-model="val.purchaseQuantity" label="数量" type="digit" placeholder="请输入数量"/>
            <van-stepper allow-empty style="width: 170px;" v-model="val.purchaseQuantity" step="1" min="0" integer />
          </div>
          <div class="row">
            <van-field v-model="val.price" :formatter="priceFormatter" label="单价" type="number" placeholder="请输入单价"/>
            <van-stepper allow-empty style="width: 170px;" v-model="val.price" step="1" min="0" integer />
          </div>
          <div class="action-bar">
            <van-button icon="minus" type="danger" size="small" @click="delDataItem(i)">删除</van-button>
            <van-button icon="plus" type="primary" size="small" @click="addDataItem(i)">添加</van-button>
          </div>
        </van-tab>
      </van-tabs>
    </div>
    <div class="text-input">
      <van-field v-model="customerName" label="购货单位" placeholder="请输入购货单位"/>
      <van-field v-model="drawer" label="开票人" placeholder="请输入开票人"/>
    </div>
    <van-field
      v-model="printer"
      is-link
      readonly
      required
      name="printer"
      label="打印机"
      placeholder="点击选择打印机"
      @click="showPrintersPicker = true"
    />
    <div class="action-bar">
      <span class="btn" @click="onPrint">打印</span>
    </div>
    <van-popup v-model:show="showPrintersPicker" position="bottom">
      <van-picker
        :columns="printersList"
        @confirm="printerSelect"
        @cancel="showPrintersPicker = false"
      />
    </van-popup>
    <van-overlay :show="showOverlay">
      <div class="wrapper" @click.stop>
        <van-loading vertical>
          打印中...
        </van-loading>
      </div>
    </van-overlay>
    <bottom-nav></bottom-nav>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { showFailToast, showSuccessToast } from 'vant'
import { htmlToPdf, printPdf, getPrinters } from '@/api/index'
import HtmlImg from '@/components/HtmlImg.vue'
import BottomNav from '@/components/BottomNav.vue'
import { numberToChinese } from '@/utils'
import 'vant/es/toast/style'

const customerName = ref('')
const showPrintersPicker = ref(false)
const printer = ref('OKI DATA CORP ML5200F')
const dataList = ref([{
  productName: '',
  unit: '',
  purchaseQuantity: '',
  price: ''
}])
const drawer = ref('王')
const tabActive = ref(0)
const showOverlay = ref(false)
const printers = ref([])
const printersList = computed(() => printers.value.map((val: string) => ({ text: val, value: val })))
const printerSelect = (val: any) => {
  if (val && val.selectedOptions) {
    printer.value = val.selectedOptions[0]?.text
    showPrintersPicker.value = false
  }
}

getPrinters()
.then(res => {
  printers.value = res.data
})

const priceFormatter = (val: string) => {
  const arr = val.split('.')
  if (arr[0] && arr[0].length > 10) {
    arr[0] = arr[0].substring(0,10)
  }
  if (arr[1] && arr[1].length > 2) {
    arr[1] = arr[1].substring(0,2)
  }
  return arr.length > 1 ? arr.join('.') : arr[0]
}
const delDataItem = (i: number) => {
  if (dataList.value.length <= 1) {
    showFailToast('最低添加1项商品')
    return
  }
  dataList.value.splice(i, 1)
}
const onPrint = () => {
  if (!printer.value) {
    showFailToast('请选择打印机')
    return
  }
  showOverlay.value = true
  const params1 = {
    html: htmlStr.value,
    width: "239mm",
    height: "139mm",
  }
  htmlToPdf(params1)
  .then((res: any) => {
    const path = res.data.path
    const params2 = {
      path,
      printer_mame: printer.value
    }
    printPdf(params2)
    .then((res:any) => {
      showSuccessToast(res.msg)
      showOverlay.value = false
    })
    .catch(() => {
      showOverlay.value = false
    })
  })
  .catch(() => {
    showOverlay.value = false
  })
}

const addDataItem = (i: number) => {
  if (dataList.value.length > 7) {
    showFailToast('最多添加8项商品')
    return
  }
  dataList.value.splice(i + 1, 0, {
    productName: '',
    unit: '',
    purchaseQuantity: '',
    price: ''
  })
  setTimeout(() => {
    tabActive.value = i + 1
  })
}

const htmlStr = computed(() => {
  return `
<!DOCTYPE html>
<html>
<head>
  <title>恒通钢铁销售单</title>
</head>
<body>
  <style>
    body {
      font-family: Arial, sans-serif;
      box-sizing: border-box;
      margin: 0;
      width: 240mm;
      height: 139mm;
      padding: 20px;
      background-color: #ffffff;
    }
    .title {
      text-align: center;
      font-size: 24px;
      font-weight: bold;
    }
    .header-info {
      font-size: 16px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      margin: 10px 0;
    }
    .footer-info {
      margin: 10px 0;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    td {
      border: 1px solid black;
      padding: 6px;
      text-align: center;
    }
  </style>
  <div class="header">
    <div class="title">恒通钢铁销售单</div>
    <div class="header-info">
      <span>购货单位：${customerName.value}</span>
      <span>NO：${new Date().toISOString().slice(0, 19).replace(/[-T:]/g,'')}</span>
    </div>
  </div>
  <table>
    <tbody>
      <tr>
        <td>商品名称</td>
        <td>单位</td>
        <td>数量</td>
        <td>单价</td>
        <td>金额</td>
      </tr>
      ${
        dataList.value.map((val: any) => {
          return `
          <tr class="data-item">
            <td>${val.productName}</td>
            <td>${val.unit}</td>
            <td>${val.purchaseQuantity}</td>
            <td>${val.price}</td>
            <td>${val.price * val.purchaseQuantity}</td>
          </tr>
          `
        }).join('')
      }
      <tr>
        <td>合计金额（大写）</td>
        <td colspan="3">${
          numberToChinese(dataList.value.reduce((totalPrice: number, val: any) => totalPrice += val.purchaseQuantity * val.price, 0))
        }</td>
        <td>&yen;&nbsp;${
          dataList.value.reduce((totalPrice: number, val: any) => totalPrice += val.purchaseQuantity * val.price, 0)
        }</td>
      </tr>
    </tbody>
  </table>
  <div class="footer-info">开票人：${drawer.value}</div>
  <div >联系方式：王15138465588、朱15538381111</div>
</body>
</html>
`
})

</script>
<style scoped lang="scss">
.background-color {
  background-color: #fff;
}
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
.action-bar {
  @extend .background-color;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 60px;
  padding: 0 10px;
  &>*:not(:last-child) {
    margin-right: 10px;
  }
}
.custom-printing-page {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  .print-preview {
    flex-grow: 1;
    display: flex;
    align-items: center;
    .preview-img {
      width: 100%;
    }
  }
  .data-list,.text-input{
    @extend .background-color;
    width: 100%;
  }
  .data-list {
    .row {
      display: flex;
      flex-direction: row;
      align-items: center;
    }
  }
  .action-bar {
    .btn {
      @extend .btn;
    }
  }
  .text-input{
    @extend .background-color;

  }
}

</style>