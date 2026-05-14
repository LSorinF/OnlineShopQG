using Microsoft.AspNetCore.Mvc;
using OnlineShopQG.Server.Services.ServiceInterfaces;

namespace OnlineShopQG.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly IProductService _productService;

        public ProductsController(IProductService productService)
        {
            _productService = productService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllProducts([FromQuery] string? category, [FromQuery] string? brand)
        {
            var products = await _productService.GetProductsAsync(category, brand);
            return Ok(products);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetProductById(int id)
        {
            var product = await _productService.GetProductByIdAsync(id);
            if (product == null) return NotFound();
            return Ok(product);
        }

        [HttpGet("brand-stats")]
        public async Task<IActionResult> GetBrandStats()
        {
            var stats = await _productService.GetBrandStatsAsync();
            return Ok(stats);
        }
    }
}