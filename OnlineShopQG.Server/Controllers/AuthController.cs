using Microsoft.AspNetCore.Mvc;
using OnlineShopQG.Server.DTOs;
using OnlineShopQG.Server.Models;
using OnlineShopQG.Server.Services.ServiceInterfaces;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;


namespace OnlineShopQG.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            var result = await _authService.RegisterAsync(dto);
            if (!result.Success) return BadRequest(new { message = result.Message });

            return Ok(new { message = result.Message });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var result = await _authService.LoginAsync(dto);
            if (!result.Success) return Unauthorized(new { message = result.Message });

            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserProfile(int id)
        {
            var user = await _authService.GetUserByIdAsync(id);

            if (user == null) return NotFound(new { message = "User not found" });

            return Ok(user);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProfile(int id, [FromBody] User updatedUser)
        {
            if (id != updatedUser.Id) return BadRequest();

            var result = await _authService.UpdateUserProfileAsync(updatedUser);
            if (!result) return BadRequest(new { message = "Update failed" });

            return Ok(new { message = "Profile updated successfully" });
        }
    }
}