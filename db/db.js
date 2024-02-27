const pg = require("pg");
const bcrypt = require("bcryptjs");

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
      console.error("Error fetching posts from db:", err);
    } 
}


async function insertBlogPosts(values) {
    try {
      const queryText = 'INSERT INTO blogs(author, text, dateposted) VALUES($1, $2, $3)'
      await sqlClient.query(queryText, values);
    } catch (err) {
        console.error("Error inserting to db:", err);
    } 
}

async function getUser(username) {
  try {
    const queryText = "SELECT * FROM users WHERE username = $1;";
    return (await sqlClient.query(queryText, [username])).rows;
  } catch (err) {
      console.error("Error getting user in db:", err);
      return err;
  } 
}

async function setUser(name, username, password) {
  bcrypt.hash(password, 10, async (err, hashedPassword) => {
      if (err) throw err;
      const query = 'INSERT INTO users(name, username, password, datejoined) VALUES($1, $2, $3, $4)'
      const value = [name, username, hashedPassword, new Date()];
      try {
        await sqlClient.query(query, value);
      } catch(err) {
        console.log("error on setting user:" + err);
      }
  });
}

module.exports = {
    connect,
    fetchBlogPosts,
    insertBlogPosts,
    getUser,
    setUser
};