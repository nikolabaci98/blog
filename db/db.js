const pg = require("pg");

const sqlClient = new pg.Client({
    host: 'localhost',
    port: 5000,
    database: 'blog',
    user: 'postgres',
    password: '8991',
});

async function connect(){
    try {
      await sqlClient.connect();
    } catch (err) {
      console.error("Error connecting to db:", err);
    } 
}
  
async function fetchBlogPosts() {
    try {
      const queryResult = await sqlClient.query("SELECT * FROM blogs ORDER BY dateposted DESC");
      return queryResult.rows;
    } catch (err) {
      console.error("Error connecting to db:", err);
    } 
}

async function insertBlogPosts(queryText, values) {
    try {
        await sqlClient.query(queryText, values);
    } catch (err) {
        console.error("Error connecting to db:", err);
    } 
}

module.exports = {
    connect,
    fetchBlogPosts,
    insertBlogPosts
};