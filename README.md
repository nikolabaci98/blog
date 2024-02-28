# blog
 
Simple blog website with no DB intergration.

Using NodeJS, ExpressJS, EJS in the server side and BootStrap, CSS and HTML in the client side.

Next steps:
1. Database Integration
     [x] Develop schema for user, blogs, comments
     [x] Integrate Serialize npm package to implement the model of MVC
     [x] Develop a session db, for persisten user auth across server restarts

2. User Authentication:
     [x] Login
          [x] Store user session
          [x] Error on login
     [x] Sign up
          [x] Save new user
          [x] Error on sign up

3. User Actions:
     [x] Logout
     [x] Post blogs
     [] Delete blogs
     [] Comment on posts
