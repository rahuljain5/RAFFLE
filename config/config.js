module.exports = {
  development: {
    connection_url: process.env.DATABASE_URL,
    api_key: "",
    redis_url : process.env.REDIS_URL || "redis://localhost:6379"
  },
  test: {
    connection_url: "mongodb://localhost:27017/",
    api_key: "",
    usn: "1ox15cs",
    redis_url : process.env.REDIS_URL
  },
  production: {
    connection_url: process.env.DATABASE_URL,
    api_key: process.env.API_KEY,
    redis_url : process.env.REDIS_URL
  },
  result_url: 'http://results.vtu.ac.in/vitaviresultcbcs/resultpage.php',
  result_ttl : 14*24*60*60//14 Days
};
