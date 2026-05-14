using OnlineShopQG.Server.Models;

namespace OnlineShopQG.Server.Repositories.RepositoryInterfaces
{
    public interface IUserRepository
    {
        Task<User?> GetUserByEmailAsync(string email);
        Task<bool> CreateUserAsync(User user);
        Task<User?> GetUserByIdAsync(int id);

        Task<bool> UpdateUserAsync(User user);
    }
}
