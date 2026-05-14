using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.Contracts;

namespace OnlineShopQG.Server.Models
{
    public class Order
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public DateTime OrderDate { get; set; }
        public decimal TotalAmount { get; set; }
        public string ShippingAddress { get; set; } = string.Empty;
        public List<OrderItem> Items { get; set; } = new List<OrderItem>();
    }
}
