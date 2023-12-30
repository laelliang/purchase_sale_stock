<template>
  <img @click="imgClick" :src="imgSrc" class="html-img">
  <iframe :src="iframeSrc" ref="iframeRef" width="100%" height="100%" class="iframe"></iframe>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { domToImg } from '@/utils'
import { showImagePreview } from 'vant'
const props = defineProps({
  htmlStr: {
    type: String,
    required: true
  }
})
const iframeSrc = window.location.hostname

const iframeRef = ref(null)
const imgSrc= ref('')
let timerId: any = null
const obj = domToImg()
let iframeDom: any = undefined
let iframeDocument: any = undefined
let iframeWindow: any = undefined
onMounted(() => {
  iframeDom = iframeRef.value as any
  iframeDom.onload = () => {
    iframeWindow = iframeDom.contentWindow
    iframeDocument = iframeWindow.document
  }
})
const setImgSrc = (str: string) => {
  iframeDocument.body.innerHTML = str
  obj.dom = iframeDocument.body
  obj.dom2Svg().then((url: string) => {
    imgSrc.value = url
  })
}

const imgClick = ()=> {
  showImagePreview([imgSrc.value])
}

watch(() => props.htmlStr, (newVal: any) => {
  if (timerId) {
    clearTimeout(timerId)
    timerId = setTimeout(() => {
      setImgSrc(newVal)
      timerId = null
    }, 500)
  } else {
    timerId = setTimeout(() => {
      setImgSrc(newVal)
      timerId = null
    }, 500)
  }
})

</script>
<style scoped lang="scss">
.iframe {
  border: 0;
  width: 0;
  height: 0;
}
.html-img {
  width: 100%;
}
</style>