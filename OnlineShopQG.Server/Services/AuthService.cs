using Microsoft.IdentityModel.Tokens;
using OnlineShopQG.Server.DTOs;
using OnlineShopQG.Server.Models;
using OnlineShopQG.Server.Repositories.RepositoryInterfaces;
using OnlineShopQG.Server.Services.ServiceInterfaces;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace OnlineShopQG.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly IConfiguration _configuration;

        public AuthService(IUserRepository userRepository, IConfiguration configuration)
        {
            _userRepository = userRepository;
            _configuration = configuration;
        }

        public async Task<AuthResult> RegisterAsync(RegisterDto dto)
        {
            var existingUser = await _userRepository.GetUserByEmailAsync(dto.Email);
            if (existingUser != null)
            {
                return new AuthResult { Success = false, Message = "User already exists." };
            }

            var user = new User
            {
                Name = dto.Name,
                Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                DateRegistered = DateTime.Now,
                AddressLine = dto.AddressLine,
                City = dto.City,
                State = dto.State,
                ZipCode = dto.ZipCode,
                Country = dto.Country,
                PhoneNumber = dto.PhoneNumber
            };

            var created = await _userRepository.CreateUserAsync(user);

            if (!created)
                return new AuthResult { Success = false, Message = "Registration failed." };

            return new AuthResult { Success = true, Message = "Registration successful!" };
        }


        public async Task<LoginResponseDto> LoginAsync(LoginDto dto)
        {
            var user = await _userRepository.GetUserByEmailAsync(dto.Email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            {
                return new LoginResponseDto { Success = false, Message = "Invalid email or password." };
            }

            var token = GenerateJwtToken(user);

            return new LoginResponseDto
            {
                Success = true,
                Message = "Login successful!",
                Token = token,
                UserId = user.Id,
                Name = user.Name
            };
        }

        public async Task<User?> GetUserByIdAsync(int id)
        {
            return await _userRepository.GetUserByIdAsync(id);
        }

        private bool VerifyPassword(string password, string storedHash)
        {
            return BCrypt.Net.BCrypt.Verify(password, storedHash);
        }

        private string GenerateJwtToken(User user)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Name)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public async Task<bool> UpdateUserProfileAsync(User updatedUser)
        {
            // Bridge with the database to update the user profile
            return await _userRepository.UpdateUserAsync(updatedUser);
        }
    }
}