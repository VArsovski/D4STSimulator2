using System.IO;
using Microsoft.AspNetCore.Mvc;

namespace D4ST_Api.Controllers
{
    // [Authorize]
    public class FallbackController: Controller
    {
        public IActionResult Index() {
            return PhysicalFile(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "index.html"), "text/HTML");
        }
    }
}
