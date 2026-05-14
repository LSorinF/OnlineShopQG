using Microsoft.Data.SqlClient;
using OnlineShopQG.Server.Data;
using OnlineShopQG.Server.Models;

public class OrderRepository : IOrderRepository
{
    private readonly ISqlConnectionFactory _connectionFactory;

    public OrderRepository(ISqlConnectionFactory connectionFactory)
    {
        _connectionFactory = connectionFactory;
    }

    public async Task<int> CreateOrderAsync(Order order)
    {
        using var connection = _connectionFactory.CreateConnection();
        await connection.OpenAsync();

        using var transaction = ((SqlConnection)connection).BeginTransaction();

        try
        {
            //Insert command, ask for Id of the order
            string orderSql = @"
                INSERT INTO Orders (UserId, OrderDate, TotalAmount, ShippingAddress)
                VALUES (@UserId, @OrderDate, @TotalAmount, @ShippingAddress);
                SELECT CAST(SCOPE_IDENTITY() as int);";

            using var orderCommand = new SqlCommand(orderSql, (SqlConnection)connection, transaction);
            orderCommand.Parameters.AddWithValue("@UserId", order.UserId);
            orderCommand.Parameters.AddWithValue("@OrderDate", order.OrderDate);
            orderCommand.Parameters.AddWithValue("@TotalAmount", order.TotalAmount);
            orderCommand.Parameters.AddWithValue("@ShippingAddress", order.ShippingAddress ?? (object)DBNull.Value);

            // Get new Id of the order
            int orderId = (int)await orderCommand.ExecuteScalarAsync();

            // Insert items for the order
            string itemSql = @"
                INSERT INTO OrderItems (OrderId, ProductId, Quantity, UnitPrice)
                VALUES (@OrderId, @ProductId, @Quantity, @UnitPrice);";

            foreach (var item in order.Items)
            {
                using var itemCommand = new SqlCommand(itemSql, (SqlConnection)connection, transaction);
                itemCommand.Parameters.AddWithValue("@OrderId", orderId);
                itemCommand.Parameters.AddWithValue("@ProductId", item.ProductId);
                itemCommand.Parameters.AddWithValue("@Quantity", item.Quantity);
                itemCommand.Parameters.AddWithValue("@UnitPrice", item.UnitPrice);

                await itemCommand.ExecuteNonQueryAsync();
            }

            transaction.Commit();

            // Clear the cart after creating the order
            string clearCartSql = "DELETE FROM CartItems WHERE UserId = @UserId";
            using var clearCommand = new SqlCommand(clearCartSql, (SqlConnection)connection, transaction);
            clearCommand.Parameters.AddWithValue("@UserId", order.UserId);
            await clearCommand.ExecuteNonQueryAsync();

            return orderId;
        }
        catch (Exception ex)
        {
            transaction.Rollback();
            throw new Exception("Eroare la salvarea comenzii", ex);
        }
    }
}