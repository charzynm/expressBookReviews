const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books, null, 4))
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(JSON.stringify(books[isbn], null, 4))
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  res.send(JSON.stringify(getBooksByAuthor(author), null, 4))
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  console.log(title)
  res.send(JSON.stringify(getBooksByTitle(title), null, 4))
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(JSON.stringify(books[isbn].reviews, null, 4))
});

function getBooksByAuthor(authorName) {
  let result = [];
  for (let id in books) {
      if (books[id].author === authorName) {
          result.push(books[id]);
      }
  }
  return result;
}

function getBooksByTitle(title) {
  let result = [];
  for (let id in books) {
      if (books[id].title === title) {
          result.push(books[id]);
      }
  }
  return result;
}

module.exports.general = public_users;
