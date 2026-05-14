using OnlineShopQG.server.Repositories;
using OnlineShopQG.Server.Repositories.RepositoryInterfaces;
using OnlineShopQG.Server.Services.ServiceInterfaces;

public class CartService : ICartService
{
    private readonly ICartRepository _cartRepository;

    public CartService(ICartRepository cartRepository)
    {
        _cartRepository = cartRepository;
    }

    public async Task<IEnumerable<object>> GetCartByUserIdAsync(int userId)
    {
        return await _cartRepository.GetCartItemsAsync(userId);
    }

    public async Task AddToCartAsync(int userId, int productId, int quantity)
    {
        await _cartRepository.UpsertCartItemAsync(userId, productId, quantity);
    }

    public async Task RemoveFromCartAsync(int userId, int productId)
    {
        await _cartRepository.DeleteCartItemAsync(userId, productId);
    }
}