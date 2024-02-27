const express = require('express');
const passport = require("passport");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcryptjs");
const db = require("../db/db.js");

const router = express.Router();

passport.use(
    new LocalStrategy(
        async function verify(username, password, cb) {
            try{
                const row = await db.getUser(username);
                if(row.length === 0){
                    return cb(null, false, { message: 'Incorrect username' });
                }
                try{
                    const success = await bcrypt.compare(password, row[0].password);
                    if(!success){
                        return cb(null, false, { message: 'Incorrect password' });
                    } else {
                        return cb(null, row[0]);
                    }
                }catch(err) {
                    console.log("Erron on authenticating user: " + err);
                }
            } catch (err) {
                return cb(err);
            }
        }
    )
);

passport.serializeUser(function(user, done, msg) {
    done(null, user);
 });

 passport.deserializeUser(function(user, done) {
    done(null, user);
 });
 

router.get("/login", (req, res) => {
    res.render("auths/login");
});

router.post("/login/submit", 
    passport.authenticate('local', {
        successRedirect: '/home',
        failureRedirect: '/auth/login'
    }));

router.get("/signup", (req, res) => {
    res.render("auths/signup");
});

router.post("/signup/submit", async (req, res) => {
    const { name, username, password } = req.body;
    try {
        // You need to await the asynchronous call to getUser
        const row = await db.getUser(username);
        console.log(row);
        if (row.length === 0) {
            try {
                // Also, you should await the asynchronous call to setUser
                await db.setUser(name, username, password);
                res.redirect("/auth/login");
            } catch (err) {
                console.log("Error" + err);
                // If there's an error setting the user, you should handle it appropriately
                res.status(500).send("Error creating user");
            }
        } else {
            // Correct the path for the render function, remove the leading slash
            res.render("auths/signup", { msg: "User already exists." });
        }
    } catch (err) {
        console.log("Error on sign up submit" + err);
        // If there's an error getting the user, you should handle it appropriately
        res.status(500).send("Error checking user");
    }
});

router.get('/logout', (req, res) => {
    req.logout((err) => {
        if(err) {
            console.log("Error while logging out:" + err);
        } else {
             res.redirect('/auth/login');
        }
    });
});

function ensureAuthenticated(req, res, next) {
    // If user is authenticated, proceed to the next middleware/route handler
    if (req.isAuthenticated()) {
        return next();
    }
    // If user is not authenticated, redirect to the login page or send an error response
    res.redirect('/auth/login'); // You can customize the redirect URL as needed
}

module.exports = {
    router: router,
    ensureAuthenticated: ensureAuthenticated
};