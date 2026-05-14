namespace OnlineShopQG.Server.Repositories.RepositoryInterfaces
{
    public interface ICartRepository
    {
        Task<IEnumerable<object>> GetCartItemsAsync(int userId);
        Task UpsertCartItemAsync(int userId, int productId, int quantity);
        Task DeleteCartItemAsync(int userId, int productId);
    }
}
