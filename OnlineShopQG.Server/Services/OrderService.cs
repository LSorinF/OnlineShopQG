using OnlineShopQG.Server.DTOs;
using OnlineShopQG.Server.Models;
using OnlineShopQG.Server.Repositories;
using OnlineShopQG.Server.Repositories.RepositoryInterfaces;
using OnlineShopQG.Server.Services.ServiceInterfaces;

namespace OnlineShopQG.Server.Services
{
    public class OrderService : IOrderService
    {
        private readonly IOrderRepository _orderRepository;
        private readonly IProductRepository _productRepository; 

        public OrderService(IOrderRepository orderRepository, IProductRepository productRepository)
        {
            _orderRepository = orderRepository;
            _productRepository = productRepository;
        }

        public async Task<int> PlaceOrderAsync(CreateOrderDto dto)
        {
            if (dto == null || !dto.Items.Any())
            {
                throw new ArgumentException("Coșul este gol!");
            }

            decimal realTotalAmount = 0;
            var validatedOrderItems = new List<OrderItem>();

            foreach (var itemDto in dto.Items)
            {
                var realProduct = await _productRepository.GetProductByIdAsync(itemDto.ProductId);

                if (realProduct == null)
                {
                    throw new ArgumentException($"Produsul cu ID-ul {itemDto.ProductId} nu mai există!");
                }

                decimal securePrice = realProduct.Price;

                // Add the real total
                realTotalAmount += securePrice * itemDto.Quantity;

                //The list with the verified prices
                validatedOrderItems.Add(new OrderItem
                {
                    ProductId = itemDto.ProductId,
                    Quantity = itemDto.Quantity,
                    UnitPrice = securePrice 
                });
            }

            var order = new Order
            {
                UserId = dto.UserId,
                OrderDate = DateTime.UtcNow,
                TotalAmount = realTotalAmount, 
                ShippingAddress = dto.ShippingAddress,
                Items = validatedOrderItems
            };

            return await _orderRepository.CreateOrderAsync(order);
        }
    }
}