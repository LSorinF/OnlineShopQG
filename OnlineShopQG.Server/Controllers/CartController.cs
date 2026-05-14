using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OnlineShopQG.Server.Data;
using OnlineShopQG.Server.Models;
using OnlineShopQG.Server.DTOs;
using OnlineShopQG.Server.Services.ServiceInterfaces;

namespace OnlineShopQG.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // Protect with JWT
    public class CartController : ControllerBase
    {
        private readonly ICartService _cartService;

        public CartController(ICartService cartService)
        {
            _cartService = cartService;
        }

        [HttpGet("{userId}")]
        public async Task<IActionResult> Get(int userId)
        {
            var cart = await _cartService.GetCartByUserIdAsync(userId);
            return Ok(cart);
        }

        [HttpPost("add")]
        public async Task<IActionResult> Add([FromBody] CartDto dto)
        {
            await _cartService.AddToCartAsync(dto.UserId, dto.ProductId, dto.Quantity);
            return Ok(new { message = "Item added to database" });
        }

        [HttpDelete("remove/{userId}/{productId}")]
        public async Task<IActionResult> Remove(int userId, int productId)
        {
            await _cartService.RemoveFromCartAsync(userId, productId);
            return Ok();
        }
    }
}