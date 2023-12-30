import instance from './instance'


export const importProductsFromCSV = (data: any[]) => {
  return instance.post('/api/importProductsFromCSV',{
    data: data
  })
}

export const getAllProducts = () => {
  return instance.get('/api/getAllProducts')
}

export const addDocument = (data: any) => {
  return instance.post('/api/addDocument', data)
}

export const login = (data: any) => {
  return instance.post('/api/login', data)
}

export const getUserActionHistory = (data: any) => {
  return instance.post('/api/getUserActionHistory', data)
}

export const getTemplates = () => {
  return instance.get('/api/getTemplates')
}

export const getPrinters = () => {
  return instance.get('/net/printers')
}

export const printPdf = (data: any) => {
  return instance.post('/net/printPdf',data)
}

export const htmlToPdf = (data: any) => {
  return instance.post('/api/htmlToPdf',data)
}