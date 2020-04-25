using Microsoft.AspNetCore.Builder;

namespace D4ST_Api.Controllers.ExtensionsAndHandlers
{
    public static class ApiKeyExtensions {
        public static IApplicationBuilder UseApiKey(this IApplicationBuilder builder) {
            return builder.UseMiddleware<ApiKeyHandler>();
        }
    }
}