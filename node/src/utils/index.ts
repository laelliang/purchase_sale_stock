const puppeteer = require('puppeteer')
const path = require('path')
const fs = require('fs').promises
import config from '@/config'



export const htmlPrint = async (val: any) => {

  const browser = await puppeteer.launch({
    headless: "new"
  })
  const page = await browser.newPage()

  await page.setContent(val.html)
  const fileName = Date.now() + '.pdf'

  const pdfPath = path.join(config.pdf_folder_path, fileName)
  await page.pdf({
    path: pdfPath,
    width: val.width,
    height: val.height
  })
  await browser.close();
  return pdfPath
}