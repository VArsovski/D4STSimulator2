using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using D4ST_Api.Models.Helpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace D4ST_Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController: ControllerBase
    {
        private Dictionary<string, string> AllowedUserKeys { get; set; }
        public AuthController()
        {
            this.AllowedUserKeys = new Dictionary<string, string>();
            this.AllowedUserKeys["d4STSimulatorDemo"] = "EZPZLEMONSQEEZE";
        }

        public class AccessorKeyModel { public string Name { get; set; } public string Key { get; set; } }
        
        // [HttpPost]
        // [Route("InitAccess")]
        // public async Task<IActionResult> InitAccess([FromBody]AccessorKeyModel model)
        // {
        //     var keyEncoded = StringHelper.DecodeFrom64(model.Key);
        //     if (this.AllowedUserKeys[model.Name] != keyEncoded)
        //         return Unauthorized();

        //     // TODO: Save the GeneratedKey for further usage..
        //     var generatedKey = GenerateString(8);
        //     var claims = new[] {
        //         new Claim(ClaimTypes.NameIdentifier, generatedKey),
        //         new Claim(ClaimTypes.Name, model.Name)
        //     };

        //     var keyEncrypted = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(keyEncoded));
        //     var creds = new SigningCredentials(keyEncrypted, SecurityAlgorithms.HmacSha512);

        //     var descriptor = new SecurityTokenDescriptor {
        //         Subject = new ClaimsIdentity(claims),
        //         Expires = DateTime.Now.AddMonths(1),
        //         SigningCredentials = creds
        //     };

        //     var tokenHandler = new JwtSecurityTokenHandler();
        //     var token = tokenHandler.CreateToken(descriptor);

        //     return await Task.Run(() => Ok(new {token = tokenHandler.WriteToken(token)}));
        // }

        [Route("/InitAccess")]
        public async Task<IActionResult> InitAccess(AccessorKeyModel model)
        {
            var keyEncoded = StringHelper.DecodeFrom64(model.Key);
            if (this.AllowedUserKeys[model.Name] != keyEncoded)
                return Unauthorized();

            // TODO: Save the GeneratedKey for further usage..
            var generatedKey = GenerateString(8);
            var claims = new[] {
                new Claim(ClaimTypes.NameIdentifier, generatedKey),
                new Claim(ClaimTypes.Name, model.Name)
            };

            var keyEncrypted = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(keyEncoded));
            var creds = new SigningCredentials(keyEncrypted, SecurityAlgorithms.HmacSha512);

            var descriptor = new SecurityTokenDescriptor {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddMonths(1),
                SigningCredentials = creds
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(descriptor);

            return await Task.Run(() => Ok(new {token = tokenHandler.WriteToken(token)}));
        }

        private string GenerateString(int length) {
            var sb = new StringBuilder();
            var random = new Random();

            for (int i = 0; i < length; i++)
            {
                var generateNumber = random.Next() % 4 == 0;
                if (generateNumber) {
                    sb.Append(random.Next(0, 9).ToString());
                }
                else {
                    var offset = random.Next(1, 26);
                    sb.Append(Convert.ToChar(offset + 65));
                }
            }

            return (DateTime.UtcNow.Day + 20) + sb.ToString().ToUpper() + DateTime.UtcNow.Date.ToShortTimeString().Replace(":", "");
        }

    }
}
