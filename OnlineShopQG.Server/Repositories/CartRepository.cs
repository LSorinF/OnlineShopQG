using Microsoft.Data.SqlClient;
using OnlineShopQG.Server.Data;
using OnlineShopQG.Server.Repositories.RepositoryInterfaces;
using System.Data;

namespace OnlineShopQG.server.Repositories
{
    public class CartRepository : ICartRepository
    {
        private readonly ISqlConnectionFactory _connectionFactory;

        public CartRepository(ISqlConnectionFactory connectionFactory)
        {
            _connectionFactory = connectionFactory;
        }

        public async Task<IEnumerable<object>> GetCartItemsAsync(int userId)
        {
            var items = new List<object>();
            using var connection = (SqlConnection)_connectionFactory.CreateConnection();
            using var command = connection.CreateCommand();

            command.CommandText = @"
                SELECT c.Id, c.UserId, c.ProductId, c.Quantity, p.Name, p.Price 
                FROM CartItems c
                JOIN Products p ON c.ProductId = p.Id
                WHERE c.UserId = @UserId";

            command.Parameters.AddWithValue("@UserId", userId);

            if (connection.State != ConnectionState.Open) await connection.OpenAsync();

            using var reader = await command.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                items.Add(new
                {
                    id = reader["Id"],
                    userId = reader["UserId"],
                    productId = reader["ProductId"],
                    quantity = reader["Quantity"],
                    product = new
                    {
                        id = reader["ProductId"],
                        name = reader["Name"],
                        price = reader["Price"]
                    }
                });
            }
            return items;
        }

        public async Task UpsertCartItemAsync(int userId, int productId, int quantity)
        {
            using var connection = (SqlConnection)_connectionFactory.CreateConnection();
            using var command = connection.CreateCommand();

            command.CommandText = @"
                IF EXISTS (SELECT 1 FROM CartItems WHERE UserId = @UserId AND ProductId = @ProductId)
                BEGIN
                    UPDATE CartItems SET Quantity = Quantity + @Quantity 
                    WHERE UserId = @UserId AND ProductId = @ProductId
                END
                ELSE
                BEGIN
                    INSERT INTO CartItems (UserId, ProductId, Quantity)
                    VALUES (@UserId, @ProductId, @Quantity)
                END";

            command.Parameters.AddWithValue("@UserId", userId);
            command.Parameters.AddWithValue("@ProductId", productId);
            command.Parameters.AddWithValue("@Quantity", quantity);

            if (connection.State != ConnectionState.Open) await connection.OpenAsync();
            await command.ExecuteNonQueryAsync();
        }

        public async Task DeleteCartItemAsync(int userId, int productId)
        {
            using var connection = (SqlConnection)_connectionFactory.CreateConnection();
            using var command = connection.CreateCommand();

            command.CommandText = "DELETE FROM CartItems WHERE UserId = @UserId AND ProductId = @ProductId";
            command.Parameters.AddWithValue("@UserId", userId);
            command.Parameters.AddWithValue("@ProductId", productId);

            if (connection.State != ConnectionState.Open) await connection.OpenAsync();
            await command.ExecuteNonQueryAsync();
        }
    }
}