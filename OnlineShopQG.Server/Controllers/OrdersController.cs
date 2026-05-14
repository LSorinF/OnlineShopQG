using Microsoft.AspNetCore.Mvc;
using OnlineShopQG.Server.DTOs;
using OnlineShopQG.Server.Services.ServiceInterfaces;

namespace OnlineShopQG.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public OrdersController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        [HttpPost]
        public async Task<IActionResult> PlaceOrder([FromBody] CreateOrderDto dto)
        {
            try
            {
                int orderId = await _orderService.PlaceOrderAsync(dto);
                return Ok(new { message = "Comanda a fost plasată cu succes!", orderId = orderId });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Eroare internă la salvarea comenzii.", details = ex.Message });
            }
        }
    }
}