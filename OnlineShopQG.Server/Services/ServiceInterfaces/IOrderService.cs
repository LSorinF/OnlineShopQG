using OnlineShopQG.Server.DTOs;

namespace OnlineShopQG.Server.Services.ServiceInterfaces
{
    public interface IOrderService
    {
        Task<int> PlaceOrderAsync(CreateOrderDto dto);
    }
}