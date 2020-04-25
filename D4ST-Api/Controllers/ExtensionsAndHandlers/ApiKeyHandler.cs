using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using System.Web;

namespace D4ST_Api.Controllers.ExtensionsAndHandlers
{
    public class ApiKeyHandler : IHttpAsyncHandler
    {
        private ILogger _logger;

        public ApiKeyHandler(){ _logger = new LoggerFactory().CreateLogger("Logger"); }
        public ApiKeyHandler(ILoggerFactory loggerFactory) { _logger = loggerFactory.CreateLogger("Logger"); }

        public async Task Middleware(HttpContext context, Func<Task> next)
        {
            _logger.LogInformation("Handling API key for: " + context.Request.Path);
            await this.Invoke(context, next);
            await next.Invoke();
            //_logger.LogInformation("Finished handling api key.");
        }

        public async Task Invoke(HttpContext context, Func<Task> next)
        {
            _logger.LogInformation("Handling API key for: " + context.Request.Path);
            var routeData = context.Request.RouteValues;
            var controller = routeData["Controller"];
            var action = routeData["Action"];
            var authHeader = context.Request.Headers["Authorization"];
            var ip = context.Connection.RemoteIpAddress;

            await Task.Run(() => {
                if (authHeader.Count == 0)
                    new System.Net.Http.HttpResponseMessage(System.Net.HttpStatusCode.Unauthorized);
            });

            //_logger.LogInformation("Finished handling api key.");
            //await Task.Run(() => { return null; });
        }
    }
}
