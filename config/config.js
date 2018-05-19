module.exports = {
  development: {
    connection_url: process.env.MONGODB_URI,
    api_key: "",
    DBNAme: process.env.DBname,
    redis_url : process.env.REDIS_URL || "redis://localhost:6379",
    userdb_url: process.env.DATABASE_URL || "mysql://dummyuser:dummy123@db4free.net:3307/dummymysql",
    loginTtl: 10.00 * 60.00, //mins
    forgotexpiry : 10.00 * 60.00 * 24 ,// 1 day
    jwtKey: process.env.JWT_KEY || "secret",
    salt: process.env.COMMON_SALT || "13b7654d-fd16-488b-9e25-2113f478ccbf",
    mailer_host: "smtp.sendgrid.net",
    mailer_port: "587",
    mailer_username: "apikey",
    mailer_password: process.env.MAILER_PASSWORD,
    totpLable : "RAFFLE-DEVELOPMENT"
  },
  test: {
    connection_url: "mongodb://localhost:27017/RAFFLE",
    api_key: "",
    usn: "1ox15cs",
    userdb_url: process.env.DATABASE_URL,
    redis_url : process.env.REDIS_URL,
    loginTtl: 10.00 * 60.00, //mins
    forgotexpiry: 10.00 * 60.00 * 24,// 1 day
    jwtKey: process.env.JWT_KEY || "secret",
    salt: process.env.COMMON_SALT || "13b7654d-fd16-488b-9e25-2113f478ccbf",
    mailer_host: "smtp.sendgrid.net",
    mailer_port: "587",
    mailer_username: "apikey",
    mailer_password: process.env.MAILER_PASSWORD,
    totpLable: "RAFFLE-UAT"
  },
  production: {
    connection_url: process.env.MONGODB_URI,
    database_username : process.env.dbusername,
    database_password : process.env.dbpasssword,
    userdb_url: process.env.USERDB_URL,
    api_key: process.env.API_KEY,
    redis_url : process.env.REDIS_URL,
    loginTtl: 10.00 * 60.00, //mins
    forgotexpiry: 10.00 * 60.00 * 24,// 1 day
    jwtKey: process.env.JWT_KEY,
    salt: process.env.COMMON_SALT,
    mailer_host: "smtp.sendgrid.net",
    mailer_port: "587",
    mailer_username: "apikey",
    mailer_password: process.env.MAILER_PASSWORD,
    totpLable: "RAFFLE"
  },
  result_url: 'http://results.vtu.ac.in/vitaviresultcbcs/resultpage.php',

  result_ttl : 14*24*60*60// 14 Days

};
