namespace OnlineShopQG.Server.DTOs
{
    public class CreateOrderDto
    {
        public int UserId { get; set; }
        public decimal TotalAmount { get; set; }
        public string ShippingAddress { get; set; }
        public List<CreateOrderItemDto> Items { get; set; }
    }
}
