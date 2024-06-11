const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
}}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }
  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  let book = books[isbn];

  if (!book) {
    return res.status(404).send('Book not found');
  }

  let review = req.body.review;
  if (!review) {
    return res.status(400).send('Review content is required');
  }

  if (!book.reviews) {
    book.reviews = {};
  }

  book.reviews[req.session.username] = review; // assuming req.session.username contains the username

  return res.send('Review added');
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (!book) {
    return res.status(404).send('Book not found');
  }

  const username = req.user.username;
  const reviews = book.reviews;

  if (!reviews[username]) {
    return res.status(404).send('Review not found');
  }

  delete reviews[username];

  return res.send('Review deleted');
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
