using Microsoft.Data.SqlClient;
using OnlineShopQG.Server.Data;
using OnlineShopQG.Server.DTOs;
using OnlineShopQG.Server.Models;
using OnlineShopQG.Server.Repositories.RepositoryInterfaces;
using System.Data;

namespace OnlineShopQG.server.Repositories
{
    public class ProductRepository : IProductRepository
    {
        private readonly ISqlConnectionFactory _connectionFactory;

        public ProductRepository(ISqlConnectionFactory connectionFactory)
        {
            _connectionFactory = connectionFactory;
        }

        public async Task<IEnumerable<Product>> GetProductsAsync(string? category, string? brand)
        {
            var products = new List<Product>();
            using var connection = (SqlConnection)_connectionFactory.CreateConnection();
            using var command = connection.CreateCommand();

            // Build SQL query
            string sql = "SELECT Id, Name, Description, Price, ImageUrl, Category, Brand FROM Products WHERE 1=1";

            if (!string.IsNullOrEmpty(category)) sql += " AND Category = @Category";
            if (!string.IsNullOrEmpty(brand)) sql += " AND Brand = @Brand";

            command.CommandText = sql;

            if (!string.IsNullOrEmpty(category)) command.Parameters.AddWithValue("@Category", category);
            if (!string.IsNullOrEmpty(brand)) command.Parameters.AddWithValue("@Brand", brand);

            if (connection.State != ConnectionState.Open) await connection.OpenAsync();

            using var reader = await command.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                products.Add(MapProduct(reader)); 
            }

            return products;
        }

        public async Task<Product?> GetProductByIdAsync(int id)
        {
            using var connection = (SqlConnection)_connectionFactory.CreateConnection();
            using var command = connection.CreateCommand();

            command.CommandText = "SELECT Id, Name, Description, Price, ImageUrl, Category, Brand FROM Products WHERE Id = @Id";
            command.Parameters.AddWithValue("@Id", id);

            if (connection.State != ConnectionState.Open) await connection.OpenAsync();

            using var reader = await command.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                return MapProduct(reader);
            }

            return null;
        }

        private Product MapProduct(SqlDataReader reader)
        {
            return new Product
            {
                Id = reader.GetInt32(reader.GetOrdinal("Id")),
                Name = reader.GetString(reader.GetOrdinal("Name")),
                Description = reader.IsDBNull(reader.GetOrdinal("Description")) ? null : reader.GetString(reader.GetOrdinal("Description")),
                Price = reader.GetDecimal(reader.GetOrdinal("Price")),
                ImageUrl = reader.IsDBNull(reader.GetOrdinal("ImageUrl")) ? null : reader.GetString(reader.GetOrdinal("ImageUrl")),
                Category = reader.IsDBNull(reader.GetOrdinal("Category")) ? null : reader.GetString(reader.GetOrdinal("Category")),
                Brand = reader.IsDBNull(reader.GetOrdinal("Brand")) ? null : reader.GetString(reader.GetOrdinal("Brand"))
            };
        }

        public async Task<IEnumerable<BrandStatDto>> GetBrandStatsAsync()
        {
            var stats = new List<BrandStatDto>();
            using var connection = (SqlConnection)_connectionFactory.CreateConnection();
            using var command = connection.CreateCommand();

            command.CommandText = "SELECT Brand, COUNT(*) as Total FROM Products WHERE Brand IS NOT NULL GROUP BY Brand";

            if (connection.State != ConnectionState.Open) await connection.OpenAsync();

            using var reader = await command.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                stats.Add(new BrandStatDto
                {
                    Brand = reader["Brand"].ToString() ?? "Unknown",
                    Count = (int)reader["Total"]
                });
            }
            return stats;
        }
    }
}