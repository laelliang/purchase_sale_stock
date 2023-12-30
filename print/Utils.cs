using System.Diagnostics;
using System.Drawing;
using System.Drawing.Printing;
using Spire.License;
using Spire.Pdf;
using Spire.Pdf.Print;
using Spire.Pdf.Tables;
using Spire.Pdf.Widget;

namespace print
{
    public static class Utils
    {
        public static string[] getPrinters()
        {
            // 获取本地打印机列表
            PrinterSettings printerSettings = new PrinterSettings();
            PrinterSettings.StringCollection printerList = PrinterSettings.InstalledPrinters;
            string[] printerArray = new string[printerList.Count];
            printerList.CopyTo(printerArray, 0);
            return printerArray;
        }

        public static void printPdf(string pdfPath, string printerName)
        {
            //创建PdfDocument类的对象，并加载PDF文档
            PdfDocument doc = new PdfDocument();
            doc.LoadFromFile(pdfPath);
            doc.PrintSettings.PrinterName= printerName;
            PaperSize PSize = new PaperSize();
            //页面边距
            //doc.PrintSettings.SetPaperMargins(0, 0, 0, 0);
            //百分之一英寸单位，约等于0.254毫米。
            //单位不明，1单位实际测量约等于3.96毫米
            PSize.Width = (int)(200 * 3.96);
            PSize.Height = (int)(139 * 3.96);


            doc.PrintSettings.PaperSize = PSize;

            //竖向打印
            doc.PrintSettings.Landscape = false;
            //关闭自动设置打印方向
            doc.PrintSettings.SelectSinglePageLayout(PdfSinglePageScalingMode.FitSize, false);
            doc.Print();
        }
    }
}
