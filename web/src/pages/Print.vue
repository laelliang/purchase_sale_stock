<template>
  <div class="print-preview" ref="previewContainer">
    <img :src="imgSrc" class="preview-img">
  </div>
  <van-field
    v-model="template"
    is-link
    readonly
    required
    name="template"
    label="打印模板"
    placeholder="点击选择打印机模板"
    @click="showTemplatesPicker = true"
  />
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
  <van-popup v-model:show="showPrintersPicker" position="bottom">
    <van-picker
      :columns="printersList"
      @confirm="printerSelect"
      @cancel="showPrintersPicker = false"
    />
  </van-popup>
  <van-popup v-model:show="showTemplatesPicker" position="bottom">
    <van-picker
      :columns="templatesList"
      @confirm="templateSelect"
      @cancel="showTemplatesPicker = false"
    />
  </van-popup>
  <van-overlay :show="showOverlay">
    <div class="wrapper" @click.stop>
      <van-loading vertical>
        打印中...
      </van-loading>
    </div>
  </van-overlay>
  <div class="action-bar">
    <span class="recede" @click="router.go(-1)">返回</span>
    <span class="confirm" @click="printDocument">确定</span>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { htmlToPdf, printPdf, getPrinters, getTemplates } from '@/api'
import { numberToChinese, domToImg } from '@/utils'
import { showFailToast, showSuccessToast } from 'vant'
import 'vant/es/toast/style'
const store = useStore()
const router = useRouter()

const previewContainer = ref(null)
const printers = ref([])
const templates = ref([])
const printer = ref('')
const template = ref('')
const showOverlay = ref(false)
const showPrintersPicker = ref(false)
const showTemplatesPicker = ref(false)
const printersList = computed(() => printers.value.map((val: string) => ({ text: val, value: val })))
const templatesList = computed(() => templates.value.map((val:any) => ({ text: val.template_name, value: val.id })))
const selectedTemplate = computed(() => templates.value?.find((val: any) => val.template_name === template.value))
const printStr = computed(() => {
  if (selectedTemplate.value) {
    const templateData = selectedTemplate.value as any
    const dataMap = new Map()
    const date = new Date().toISOString().slice(0, 19)
    dataMap.set('date', date.split('T')?.[0])
    dataMap.set('invoiceNumber', date.replace(/[-T:]/g,''))
    dataMap.set('customerName', store.state.document.customer_name)
    dataMap.set('phoneNumber', store.state.document.phone_number)
    dataMap.set('TAN', store.state.document.document_info.reduce((totalPrice: number, val: any) => totalPrice += val.purchase_quantity * val.price, 0))
    dataMap.set('TAW', numberToChinese(dataMap.get('TAN')))
    dataMap.set('userName', store.state.document.user_name)
    const htmlStr = templateData.template_string.replace(/<tr\s+class\s*=\s*["']data-item["']\s*\>.*?<\/tr>/g, (match:string) => {
      const arr = store.state.document.document_info.map((val: any, i: number) => {
        return match.replace(/\{\{([a-zA-Z_\s]*)\}\}/g, (...params:any[]) => {
          const key = params[1].trim()
          if (key === 'totalPrice') {
            return val.purchase_quantity * val.price
          } else if (key === 'i') {
            return i + 1
          } else {
            return val[key] ? val[key] : ''
          }
        })
      })
      return arr.join('')
    })
    .replace(/\{\{([a-zA-Z_\s]*)\}\}/g, (...params:any[]) => {
      const key = params[1].trim()
      const val = dataMap.get(key)
      return val ? val : ''
    })
    return htmlStr
  }
  return ''
})
const iframeDom = ref<HTMLIFrameElement>(document.createElement('iframe'))
const imgSrc = ref('')
const setImgSrc = (htmlStr: string = '') => {iframeDom
  iframeDom.value.src = window.location.hostname
  iframeDom.value.width = '100%'
  iframeDom.value.height = '100%'
  iframeDom.value.style.border = 'none'
  iframeDom.value.style.width = '0px'
  iframeDom.value.style.height = '0px'
  iframeDom.value?.parentNode?.removeChild(iframeDom.value)
  const container = previewContainer.value
  if (container) {
    (container as HTMLDivElement).appendChild(iframeDom.value)
  }
  iframeDom.value.onload = () => {
    const iframeWindow = iframeDom.value.contentWindow
    const iframeDocument = iframeWindow!.document
    iframeDocument.write(htmlStr)
    const obj = domToImg()
    obj.dom = iframeDocument.body
    obj.dom2Svg().then((imgUrl: string) => {
      imgSrc.value = imgUrl
    })
  }
}

const printDocument = () => {
  if (!printer.value) {
    showFailToast('请选择打印机')
    return
  }
  if (!template.value) {
    showFailToast('请选择模板')
    return
  }
  
  showOverlay.value = true
  const templateData = selectedTemplate.value as any
  const params1 = {
    html: printStr.value,
    width: templateData ? templateData.template_width : "",
    height: templateData ? templateData.template_height : "",
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

onMounted(() => {
  setImgSrc()
})

getPrinters()
.then(res => {
  printers.value = res.data
})

getTemplates()
.then(res => {
  templates.value = res.data
})

const printerSelect = (val: any) => {
  if (val && val.selectedOptions) {
    printer.value = val.selectedOptions[0]?.text
    showPrintersPicker.value = false
  }
}

const templateSelect = (val: any) => {
  if (val && val.selectedOptions) {
    template.value = val.selectedOptions[0]?.text
    showTemplatesPicker.value = false
    setImgSrc(printStr.value)
  }
}

</script>
<style scoped lang="scss">

.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
.print-preview {
  flex-grow: 1;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  .preview-img {
    width: 100%;
  }
}

.action-bar {
  display: flex;
  justify-content: right;
  align-items: center;
  background-color: #ffffff;
  height: 60px;
  .recede,.confirm {
    margin-right: 20px;
    font-size: 18px;
    cursor: pointer;
  }
  .recede {
    color: #969799;
  }
  .confirm {
    color: #1989fa;
  }
}

</style>