using Microsoft.Data.SqlClient;

namespace OnlineShopQG.Server.Data
{
    public interface ISqlConnectionFactory
    {
        public SqlConnection CreateConnection();
    }
}
