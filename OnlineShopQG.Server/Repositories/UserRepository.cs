using Microsoft.Data.SqlClient;
using OnlineShopQG.Server.Data;
using OnlineShopQG.Server.Models;
using OnlineShopQG.Server.Repositories.RepositoryInterfaces;

namespace OnlineShopQG.Server.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly ISqlConnectionFactory _connectionFactory;

        public UserRepository(ISqlConnectionFactory connectionFactory)
        {
            _connectionFactory = connectionFactory;
        }

        public async Task<bool> CreateUserAsync(User user)
        {
            string sql = @"
                INSERT INTO Users (Name, Email, PasswordHash, DateRegistered, AddressLine, City, State, ZipCode, Country, PhoneNumber) 
                VALUES (@Name, @Email, @PasswordHash, @DateRegistered, @AddressLine, @City, @State, @ZipCode, @Country, @PhoneNumber)";

            using (var connection = _connectionFactory.CreateConnection())
            {
                await connection.OpenAsync();
                using (var command = new SqlCommand(sql, connection))
                {
                    command.Parameters.AddWithValue("@Name", user.Name);
                    command.Parameters.AddWithValue("@Email", user.Email);
                    command.Parameters.AddWithValue("@PasswordHash", user.PasswordHash);
                    command.Parameters.AddWithValue("@DateRegistered", DateTime.UtcNow);
                    command.Parameters.AddWithValue("@AddressLine", (object)user.AddressLine ?? DBNull.Value);
                    command.Parameters.AddWithValue("@City", (object)user.City ?? DBNull.Value);
                    command.Parameters.AddWithValue("@State", (object)user.State ?? DBNull.Value);
                    command.Parameters.AddWithValue("@ZipCode", (object)user.ZipCode ?? DBNull.Value);
                    command.Parameters.AddWithValue("@Country", (object)user.Country ?? DBNull.Value);
                    command.Parameters.AddWithValue("@PhoneNumber", (object)user.PhoneNumber ?? DBNull.Value);

                    int rowsAffected = await command.ExecuteNonQueryAsync();
                    return rowsAffected > 0;
                }
            }
        }
        public async Task<User?> GetUserByEmailAsync(string email)
        {
            string sql = "SELECT * FROM Users WHERE Email = @Email";

            using (var connection = _connectionFactory.CreateConnection())
            {
                await connection.OpenAsync();
                using (var command = new SqlCommand(sql, connection))
                {
                    command.Parameters.AddWithValue("@Email", email);

                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            return new User
                            {
                                Id = reader.GetInt32(reader.GetOrdinal("Id")),
                                Name = reader.GetString(reader.GetOrdinal("Name")),
                                Email = reader.GetString(reader.GetOrdinal("Email")),
                                PasswordHash = reader.GetString(reader.GetOrdinal("PasswordHash")),
                                DateRegistered = reader.GetDateTime(reader.GetOrdinal("DateRegistered")),
                            };
                        }
                        return null; 
                    }
                }
            }
        }

        public async Task<User?> GetUserByIdAsync(int id)
        {
            using var connection = _connectionFactory.CreateConnection();
            using var command = connection.CreateCommand();

            command.CommandText = @"SELECT Id, Name, Email, AddressLine, City, State, ZipCode, Country, PhoneNumber 
                            FROM Users WHERE Id = @id";

            var idParam = command.CreateParameter();
            idParam.ParameterName = "@id";
            idParam.Value = id;
            command.Parameters.Add(idParam);

            await connection.OpenAsync();
            using var reader = await command.ExecuteReaderAsync();

            if (await reader.ReadAsync())
            {
                return new User
                {
                    Id = (int)reader["Id"],
                    Name = reader["Name"].ToString(),
                    Email = reader["Email"].ToString(),
                    AddressLine = reader["AddressLine"]?.ToString(),
                    City = reader["City"]?.ToString(),
                    State = reader["State"]?.ToString(),
                    ZipCode = reader["ZipCode"]?.ToString(),
                    Country = reader["Country"]?.ToString(),
                    PhoneNumber = reader["PhoneNumber"]?.ToString()
                };
            }
            return null;
        }

        public async Task<bool> UpdateUserAsync(User user)
        {
            string sql = @"
            UPDATE Users 
            SET AddressLine = @AddressLine, 
                City = @City, 
                State = @State, 
                ZipCode = @ZipCode, 
                Country = @Country, 
                PhoneNumber = @PhoneNumber
            WHERE Id = @Id";

            using (var connection = _connectionFactory.CreateConnection())
            {
                await connection.OpenAsync();
                using (var command = new SqlCommand(sql, (SqlConnection)connection))
                {
                    command.Parameters.AddWithValue("@Id", user.Id);
                    command.Parameters.AddWithValue("@Name", user.Name);
                    command.Parameters.AddWithValue("@AddressLine", (object)user.AddressLine ?? DBNull.Value);
                    command.Parameters.AddWithValue("@City", (object)user.City ?? DBNull.Value);
                    command.Parameters.AddWithValue("@State", (object)user.State ?? DBNull.Value);
                    command.Parameters.AddWithValue("@ZipCode", (object)user.ZipCode ?? DBNull.Value);
                    command.Parameters.AddWithValue("@Country", (object)user.Country ?? DBNull.Value);
                    command.Parameters.AddWithValue("@PhoneNumber", (object)user.PhoneNumber ?? DBNull.Value);

                    return await command.ExecuteNonQueryAsync() > 0;
                }
            }
        }
    }
}