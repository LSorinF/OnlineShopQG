using OnlineShopQG.Server.Models;
using OnlineShopQG.Server.DTOs;
using OnlineShopQG.Server.Repositories.RepositoryInterfaces;
using OnlineShopQG.Server.Services.ServiceInterfaces;

namespace OnlineShopQG.Services
{
    public class ProductService : IProductService
    {
        private readonly IProductRepository _productRepository;

        public ProductService(IProductRepository productRepository)
        {
            _productRepository = productRepository;
        }

        public async Task<IEnumerable<Product>> GetProductsAsync(string? category = null, string? brand = null)
        {
            return await _productRepository.GetProductsAsync(category, brand);
        }

        public async Task<Product?> GetProductByIdAsync(int id)
        {
            return await _productRepository.GetProductByIdAsync(id);
        }

        public async Task<IEnumerable<BrandStatDto>> GetBrandStatsAsync()
        {
            return await _productRepository.GetBrandStatsAsync();
        }
    }
}