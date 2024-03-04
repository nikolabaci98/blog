var express = require('express');
const { Blog } = require("../model/index");
const ensureAuthenticated = require("./auth.js").ensureAuthenticated;
var router = express.Router();
let blogPosts = [];

router.get(["/", "/home"], async (req, res) => {
  try {
    blogPosts = await Blog.findAll();
    res.render("./pages/homepage", { user: req.user !== undefined ? req.user : "", blogPosts: blogPosts });
  } catch (error) {
    res.status(500).send("Cannot retrive the blog posts now. Try later.");
  }
});

router.get("/compose", ensureAuthenticated, (req, res) => {
  res.render("./pages/composePage", { user: req.user });
});

router.get("/profile", ensureAuthenticated, async (req, res) => {
  try {
    blogPosts = await Blog.findAll({
      where: {
        username: req.user.username
      }
    });
    res.render("./pages/profilePage", { user: req.user, blogPosts: blogPosts });
  } catch (error) {
    res.status(500).send("Cannot retrive the blog posts now. Try later.");
  }
});

router.get(router.get('/blog/:postId', ensureAuthenticated, async (req, res) => {
  const postId = req.params.postId;
  try {
    const row = await Blog.findAll({
      where: {
        id: postId
      }
    });
    res.render("./pages/blogpage", { user: req.user, blogPost: row[0] });
  } catch (err) {
    res.status(500).send(`Cannot find blog post with id = ${postId}. Try later.`);
  }
}));

router.get('/delete/:postId', ensureAuthenticated, async (req, res) => {
  console.log("Delete 5")
  const postId = req.params.postId;

  try {
    await Blog.destroy({
      where: {
        id: postId
      }
    });
    res.redirect("/profile");
  } catch (err) {
    res.status(500).send(`Cannot find blog post with id = ${postId}. Try later.`);
  }
});


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
    res.status(500).send(`Cannot save your blog post now. Try later.`);
  }
});

module.exports = router;
