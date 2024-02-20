const path = require("path")
const express = require("express");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require('uuid');

const port = 3000;
let blogPosts = [];

const app = express();

app.set('views', './views');
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended:true}));


app.get(["/", "/home"], (req, res) => {
    renderPage(res, "home");
});

app.get("/compose", (req, res) => {
    renderPage(res, "compose");
});

app.get(app.get('/blog/:postId', (req, res) => {
    const postId = req.params.postId;
    let blogPost = blogPosts.filter(blogPost => blogPost.id === postId)[0];
    renderPage(res, "blog", blogPost);
}));

app.post("/submit", (req, res) => {
    blogPosts.push({
        id: uuidv4(),
        time: getCurrentDateTime(),
        author: req.body["authorName"],
        text: req.body["blogPost"]
    });
    res.redirect("/")
});

app.use((req, res) => {
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
    
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});