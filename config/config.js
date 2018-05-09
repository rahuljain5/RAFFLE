module.exports = {
  development: {
    connection_url: process.env.MONGODB_URI,
    api_key: "",
    DBNAme: process.env.DBname,
    redis_url : process.env.REDIS_URL || "redis://localhost:6379"
  },
  test: {
    connection_url: "mongodb://localhost:27017/RAFFLE",
    api_key: "",
    usn: "1ox15cs",
    redis_url : process.env.REDIS_URL
  },
  production: {
    connection_url: process.env.DATABASE_URL,
    database_username : process.env.dbusername,
    database_password : process.env.dbpasssword,
    api_key: process.env.API_KEY,
    redis_url : process.env.REDIS_URL
  },
  result_url: 'http://results.vtu.ac.in/vitaviresultcbcs/resultpage.php',

  result_ttl : 14*24*60*60// 14 Days

};
