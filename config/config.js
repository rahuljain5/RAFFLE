module.exports = {
  development: {
    connection_url: process.env.DATABASE_URL,
    api_key:"99bff15d-d4fe-44dd-a0a3-25f177535450"
  },
  test: {
     connection_url: process.env.DATABASE_URL,
     api_key:"99bff15d-d4fe-44dd-a0a3-25f177535450",
     usn : "1ox15cs"
  },
  production: {
   connection_url: process.env.DATABASE_URL,
   api_key:process.env.API_KEY
  },
  result_url:'http://results.vtu.ac.in/vitaviresultcbcs/resultpage.php'
};
