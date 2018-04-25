module.exports = {
  development: {
    connection_url: process.env.DATABASE_URL,
    api_key:""
  },
  test: {
     connection_url: process.env.DATABASE_URL,
     api_key:"",
     usn : "1ox15cs"
  },
  production: {
   connection_url: process.env.DATABASE_URL,
   api_key:process.env.API_KEY
  },
  result_url:'http://results.vtu.ac.in/vitaviresultcbcs/resultpage.php'
};
