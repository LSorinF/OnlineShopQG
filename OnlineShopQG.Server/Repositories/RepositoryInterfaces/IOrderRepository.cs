// IOrderRepository.cs
using Microsoft.Data.SqlClient;
using OnlineShopQG.Server.Data;
using OnlineShopQG.Server.Models;

public interface IOrderRepository
{
    Task<int> CreateOrderAsync(Order order);
}
