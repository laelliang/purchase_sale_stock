using Microsoft.AspNetCore.Mvc;

namespace print.Controllers
{
    [ApiController]
    [Route("/")]
    public class ApiControler: ControllerBase
    {
        [HttpGet("printers")]
        public IActionResult GetPrinters()
        {
            string[] printerArray = Utils.getPrinters();
            return Ok(new Response
            {
                Code = 200,
                Data = printerArray
            });
        }
        [HttpPost("printPdf")]
        public IActionResult printPdf([FromBody] PrintPdfParams model)
        {
            string printer_mame = model.printer_mame;
            string path = model.path;

            Utils.printPdf(path, printer_mame);


            return Ok(new Response
            {
                Code = 200,
                Msg = "打印成功"
            });
        }

    }
}
