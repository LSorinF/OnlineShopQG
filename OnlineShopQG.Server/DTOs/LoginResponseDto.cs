namespace OnlineShopQG.Server.DTOs
{
    public class LoginResponseDto
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public string? Token { get; set; }
        public int UserId { get; set; }
        public string? Name { get; set; }
    }
}
