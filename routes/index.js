var express = require('express');
const db = require("../db/db.js");
const ensureAuthenticated = require("./auth.js").ensureAuthenticated;
var router = express.Router();
let blogPosts = [];

router.get(["/", "/home"], ensureAuthenticated, async (req, res) => {
  try {
    console.log(req.user.username);
    blogPosts = await db.fetchBlogPosts();
    renderPage(res, "home", { blogPosts });
  } catch (error) {
    console.error("Failed to fetch blog posts:", error);
    res.status(500).send("Failed to fetch blog posts");
  }
});

router.get("/compose", ensureAuthenticated, (req, res) => {
  console.log(req.user);
  renderPage(res, "compose");
});

router.get(router.get('/blog/:postId', ensureAuthenticated, (req, res) => {
  const postId = req.params.postId;
  let blogPost = blogPosts.filter(blogPost => blogPost.id.toString() === postId)[0];
  renderPage(res, "blog", blogPost);
}));

router.post("/submit", ensureAuthenticated, async (req, res) => {
  const values = [req.body["authorName"], req.body["blogPost"], getCurrentDateTime()]
  db.insertBlogPosts(values);
  res.redirect("home")
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
