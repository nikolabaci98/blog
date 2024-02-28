const express = require('express');
const passport = require("passport");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcryptjs");
const db = require("../db/db.js");
const { User } = require("../model/index");

const router = express.Router();

passport.use(
    new LocalStrategy(
        async function verify(username, password, cb) {
            try {
                const row = await User.findAll({
                    where: {
                        username: username
                    }
                });
                if (row.length === 0) {
                    return cb(null, false, { message: 'Incorrect username' });
                }
                try {
                    const success = await bcrypt.compare(password, row[0].password);
                    if (!success) {
                        return cb(null, false, { message: 'Incorrect password' });
                    } else {
                        return cb(null, row[0]);
                    }
                } catch (err) {
                    console.log("Erron on authenticating user: " + err);
                }
            } catch (err) {
                return cb(err);
            }
        }
    )
);

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});


router.get("/login", async (req, res) => {
    res.render("auths/login", { msg: "" });
});

router.post("/login/submit", (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) { return next(err); }
        if (!user) {
            // If authentication fails, set the message to "incorrect login"
            return res.render("auths/login", { msg: "Incorrect login" });
        }
        req.logIn(user, (err) => {
            if (err) { return next(err); }
            // If authentication succeeds, redirect to '/home'
            return res.redirect('/home');
        });
    })(req, res, next);
});

router.get("/signup", (req, res) => {
    res.render("auths/signup", { msg: "" });
});

router.post("/signup/submit", async (req, res) => {
    const { name, username, password } = req.body;
    try {
        // Does user exist?
        const row = await User.findAll({
            where: {
                username: username
            }
        });
        if (row.length === 0) { //user does not exist
            try {
                // Create new user
                await User.create({
                    name: name,
                    username: username,
                    password: password
                });
                res.redirect("/auth/login");
            } catch (err) {
                console.log("Error" + err);
                res.status(500).send("Error creating user");
            }
        } else {
            // User exists
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
        if (err) {
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