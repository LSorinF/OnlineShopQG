using OnlineShopQG.Server.DTOs;
using OnlineShopQG.Server.Models;

namespace OnlineShopQG.Server.Repositories.RepositoryInterfaces
{
    public interface IProductRepository
    {
        Task<IEnumerable<Product>> GetProductsAsync(string? category, string? brand);
        Task<Product?> GetProductByIdAsync(int id);
        Task<IEnumerable<BrandStatDto>> GetBrandStatsAsync();
    }
}
