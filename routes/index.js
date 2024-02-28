var express = require('express');
const db = require("../db/db.js");
const { Blog } = require("../model/index");
const ensureAuthenticated = require("./auth.js").ensureAuthenticated;
var router = express.Router();
let blogPosts = [];

router.get(["/", "/home"], ensureAuthenticated, async (req, res) => {
  try {
    blogPosts = await Blog.findAll();
    renderPage(res, "home", { blogPosts }, req.user.name);
  } catch (error) {
    console.error("Failed to fetch blog posts:", error);
    res.status(500).send("Failed to fetch blog posts");
  }
});

router.get("/compose", ensureAuthenticated, (req, res) => {
  renderPage(res, "compose", req.user.name);
});

router.get(router.get('/blog/:postId', ensureAuthenticated, (req, res) => {
  const postId = req.params.postId;
  let blogPost = blogPosts.filter(blogPost => blogPost.id.toString() === postId)[0];
  renderPage(res, "blog", blogPost, req.user.name);
}));

router.post("/submit", ensureAuthenticated, async (req, res) => {
  try {
    await Blog.create({
      username: req.user.username,
      name: req.user.name,
      title: req.body["blogTitle"],
      text: req.body["blogPost"]
    });
    res.redirect("home");
  } catch (err) {
    console.log("Error on saving blog", err);
  }
  
});

function renderPage(res, partial, blogPost, name) {
  if(partial === "home"){
      res.render("index.ejs", {
          filename: partial,
          name: name,
          blogPosts: blogPosts
      });
  } else if(partial === "blog") {
      res.render("index.ejs", {
          filename: partial,
          name: name,
          blogPost: blogPost
      });
  } else {
      res.render("index.ejs", {
          filename: partial,
          name: name
      });
  }
}

module.exports = router;
