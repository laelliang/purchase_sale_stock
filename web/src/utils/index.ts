export const readTextFile = (file: File): Promise<string> => {
  return new Promise<string>(async (resolve, reject) => {
    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target!.result as string;
      resolve(content);
    };

    reader.onerror = event => {
      reject(event.target!.error);
    };

    reader.readAsText(file);
  });
};


export const selectCSVFile = (): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    const fileInput = document.createElement('input')
    fileInput.setAttribute('type', 'file')
    fileInput.setAttribute('accept', '.csv')
  
    // 监听文件选择事件
    fileInput.addEventListener('change', (ev: Event) => {
      const inputDom = ev.target as HTMLInputElement
      if (ev.target && inputDom.files && inputDom.files.length > 0) {
        const selectedFile = inputDom.files[0]
        if (selectedFile && selectedFile.name.endsWith('.csv')) {
          readTextFile(selectedFile)
          .then(content => {
            resolve(content)
          })
          .catch(error => {
            reject(error)
          });
        } else {
          reject(new Error('文件不是.csv格式'))
        }
      } else {
        reject(new Error('文件未选择'))
      }
    })

    fileInput.click()
  });
}


export const arrToCSV = (headers: any[], data: any[]) => {
  const str = [headers, ...data].map(val => val.join(',')).join('\n')
  downloadFile('库存.csv', str)
}


// 保存字符串到本地
export const downloadFile = (filename: string, content: string) => {

  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};


export const groupArray = (data: any[], key: string) => {
  return data.reduce((arr: any, val: any) => {
    const foundGroup = arr.find((item: any) => item[0][key] === val[key])
    if (foundGroup) {
      foundGroup.push(val)
    } else {
      arr.push([val])
    }
    return arr
  }, [])
}

export const domToImg = () => {
  // 转png需要的canvas对象及其上下文
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')

  // canvas绘制图片元素方法
  const draw = function (img: HTMLImageElement) {

    const scale = 6
    const width = img.width, height = img.height
    // canvas绘制
    canvas.width = width * scale
    canvas.height = height * scale
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    // 画布清除
    context!.clearRect(0, 0, canvas.width, canvas.height);
    context!.drawImage(img, 0, 0, canvas.width, canvas.height);
    context!.scale(scale, scale)
  }
  // canvas画布绘制的原图片
  const img = new Image()
  interface Exports {
    dom: any,
    dom2Svg: () => Promise<string>
  }
  const exports: Exports = {
    dom: null,
    // DOM变成svg，并作为图片显示
    dom2Svg: function () {
      if (!this.dom) {
        return new Promise((_, reject) => {
          reject()
        })
      }
      const dom = this.dom as HTMLElement

      // 复制DOM节点
      const cloneDom = (dom as HTMLElement).cloneNode(true) as HTMLElement;
      cloneDom.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
      cloneDom.classList.remove('outline');

      let htmlSvg = `data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="${dom.offsetWidth}" height="${dom.offsetHeight}"><foreignObject x="0" y="0" width="100%" height="100%">${document.querySelector('style')?.outerHTML + new XMLSerializer().serializeToString(cloneDom)}</foreignObject></svg>`

      htmlSvg = htmlSvg.replace(/undefined/g, '').replace(/\n/g, '').replace(/\t/g, '').replace(/#/g, '%23')

      return new Promise((resolve, reject) => {
        img.onload = () => {
          draw(img)
          resolve(canvas.toDataURL())
        }
        img.onerror = () => {
          reject()
        }
        // 图片地址显示为DOM转换的svg
        img.src = htmlSvg
      })
    },
  }
  return exports
}

export const numberToChinese = (num?: number) => {
  if (num === undefined) {
    return ''
  }
  const units = ['分', '角', '元', '拾', '佰', '仟', '万', '拾万', '佰万', '仟万', '亿', '拾亿']
  const chars = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']

  const isInt = num % 1 === 0
  const numArr = isInt ? [...String(num)] : [...num.toString()]
  console.log(numArr)
  const i = isInt ? numArr.length : numArr.findIndex(val => val === '.')
  let postfix = ''
  return numArr.map((val,j) => {
    const unit = i >= j ? units[i - j + 1] : units[i - j + 2]
    if (val === '.') {
      return val
    } else {
      const n = parseInt(val)
      const char = chars[n]
      const str = n === 0 ? char : char + unit
      if (isInt && i === j + 1 ) {
        if (unit === '元' && char === '零') {
          postfix = '元整'
        } else if (unit === '元') {
          postfix = '整'
        }
      }
      return str
    }
  }).join('').replace(/[\u96f6]{2,}/g, '零').replace(/[\u96f6]*\.[\u96f6]*|\S[\u96f6]$/g, '') + postfix
}