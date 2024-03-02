# Blog

Simple blog website with no DB integration.

Using Node.js, Express.js, EJS on the server-side, and Bootstrap, CSS, and HTML on the client-side.

## Next Steps:

### 1. Database Integration

- [x] Develop schema for users, blogs, comments
- [x] Integrate Serialize npm package to implement the model of MVC
- [x] Develop a session DB for persistent user authentication across server restarts

### 2. User Authentication

- [x] Login
   - [x] Store user session
   - [x] Error handling on login
- [x] Sign up
   - [x] Save new user
   - [x] Error handling on sign up

### 3. User Actions

- [x] Logout
- [x] Post blogs
- [ ] Delete blogs
- [ ] Comment on posts

### 4. EJS File Organization

- [] Move navbar into its own file
- [] Remove the index.ejs file
- [] Server each ejs page directly from the router (no if-else)