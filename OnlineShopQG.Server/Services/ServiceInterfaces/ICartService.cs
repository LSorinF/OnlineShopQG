using OnlineShopQG.Server.Models;
using OnlineShopQG.Server.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace OnlineShopQG.Server.Services.ServiceInterfaces
{
    public interface ICartService
    {
        Task<IEnumerable<object>> GetCartByUserIdAsync(int userId);
        Task AddToCartAsync(int userId, int productId, int quantity);
        Task RemoveFromCartAsync(int userId, int productId);
    }
}
