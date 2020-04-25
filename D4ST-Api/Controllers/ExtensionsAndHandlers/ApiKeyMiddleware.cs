using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace D4ST_Api.Controllers.ExtensionsAndHandlers
{
    public class ApiKeyMiddleware {
        private readonly RequestDelegate _next;
        private readonly ILogger _logger;
        public ApiKeyMiddleware(RequestDelegate next, ILoggerFactory loggerFactory) {
            _next = next;
            _logger = loggerFactory.CreateLogger<ApiKeyMiddleware>();
        }

        public async Task Invoke(HttpContext context) {
            _logger.LogInformation("Handling API key for: " + context.Request.Path);
            var routeData = context.Request.RouteValues;
            var controller = routeData["Controller"];
            var action = routeData["Action"];
            var authHeader = context.Request.Headers["Authorization"];
            var ip = context.Connection.RemoteIpAddress;

            await Task.Run(() => {
                if (authHeader.Count == 0)
                    new System.Net.Http.HttpResponseMessage(System.Net.HttpStatusCode.Unauthorized);
                else _next.Invoke(context);
            });

            //_logger.LogInformation("Finished handling api key.");
            //await Task.Run(() => { return null; });
        }
    }
}
