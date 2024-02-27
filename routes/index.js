var express = require('express');
const db = require("../db/db.js");
var router = express.Router();
let blogPosts = [];


router.get(["/", "/home"], async (req, res) => {
  try {
    blogPosts = await db.fetchBlogPosts();
    renderPage(res, "home", { blogPosts });
  } catch (error) {
    console.error("Failed to fetch blog posts:", error);
    // Handle error appropriately, e.g., render an error page
    res.status(500).send("Failed to fetch blog posts");
  }
});

router.get("/compose", (req, res) => {
  renderPage(res, "compose");
});

router.get(router.get('/blog/:postId', (req, res) => {
  const postId = req.params.postId;
  let blogPost = blogPosts.filter(blogPost => blogPost.id.toString() === postId)[0];
  renderPage(res, "blog", blogPost);
}));

router.post("/submit", async (req, res) => {
  const queryText = 'INSERT INTO blogs(author, text, dateposted) VALUES($1, $2, $3)'
  const values = [req.body["authorName"], req.body["blogPost"], getCurrentDateTime()]
  db.insertBlogPosts(queryText, values);
  res.redirect("home")
});

router.use((req, res) => {
  res.status(404).send('<h1>404 Not Found.</h1>');
});

function getCurrentDateTime() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Adding 1 because January is 0-indexed
  const day = String(now.getDate()).padStart(2, '0');
  const year = now.getFullYear();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0'); 
  return `${month}/${day}/${year} ${hours}:${minutes}`;
}

function renderPage(res, partial, blogPost) {
  if(partial === "home"){
      res.render("index.ejs", {
          filename: partial,
          blogPosts: blogPosts
      });
  } else if(partial === "blog") {
      res.render("index.ejs", {
          filename: partial,
          blogPost: blogPost
      });
  } else {
      res.render("index.ejs", {
          filename: partial
      });
  }
}
module.exports = router;
