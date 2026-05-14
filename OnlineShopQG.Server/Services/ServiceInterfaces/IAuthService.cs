using OnlineShopQG.Server.DTOs;
using OnlineShopQG.Server.Models;

namespace OnlineShopQG.Server.Services.ServiceInterfaces
{
    public interface IAuthService
    {
        Task<AuthResult> RegisterAsync(RegisterDto dto);
        Task<LoginResponseDto> LoginAsync(LoginDto dto); 
        Task<User?> GetUserByIdAsync(int id);
        Task<bool> UpdateUserProfileAsync(User updatedUser);
    }
}
