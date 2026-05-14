using OnlineShopQG.Server.DTOs;
using OnlineShopQG.Server.Models;


namespace OnlineShopQG.Server.Services.ServiceInterfaces
{
    public interface IProductService
    {
        Task<IEnumerable<Product>> GetProductsAsync(string? category = null, string? brand = null);
        Task<Product?> GetProductByIdAsync(int id);
        Task<IEnumerable<BrandStatDto>> GetBrandStatsAsync();
    }
}
