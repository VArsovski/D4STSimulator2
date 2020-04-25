using System.Text;
using D4ST_Api.Controllers.ExtensionsAndHandlers;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
// using Microsoft.AspNetCore.Server.Kestrel.Core;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;

namespace d4st_api
{
    public class Startup
    {
        public IWebHostEnvironment HostingEnvironment { get; private set; }
        public Startup(IConfiguration configuration) { Configuration = configuration; }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers().AddNewtonsoftJson(opt => {
                opt.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
            });

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(x => {
            //     x.RequireHttpsMetadata = false;
            //     x.SaveToken = true;
                var key = Configuration.GetSection("Authentication:AuthenticationKey").Value;
                x.TokenValidationParameters = new TokenValidationParameters {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(key)),
                    ValidateIssuer = false,
                    ValidateAudience = false
                };
            });

            services.AddCors();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            this.HostingEnvironment = env;
            if (env.IsDevelopment())
                app.UseDeveloperExceptionPage();

            // app.UseHttpsRedirection();

            app.UseRouting();

            // TODO: Uncomment this for next phase [Adding Auth]
            // app.UseApiKey();

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseCors( options => {
                // TODO: And here DOESN'T... ???
                // var ahs = Configuration.GetSection("AllowedHosts").Value;
                // var ahs = new List<string>{"http://localhost:4200", "http://localhost:5000", "http://d4stsimulatordemo"};

                // Why does this work only for single Origin ??
                // ahs.ForEach( a => { options.SetIsOriginAllowed(o => o.Contains(a)); });
                options.SetIsOriginAllowedToAllowWildcardSubdomains();
                options.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
            });

            app.UseDefaultFiles();
            app.UseStaticFiles();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapFallbackToController("Index", "Fallback");
            });
        }
    }
}
