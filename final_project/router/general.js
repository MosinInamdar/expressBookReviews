const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
      if (!isValid(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});    
      }
    } 
    return res.status(404).json({message: "Unable to register user."});
  });

// using Async-Await Axios for listing books
public_users.get('/',async function (req, res) {
    const booksDetail = await books;
    res.send(booksDetail)
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
    const ISBN = req.params.isbn;
    const bookDetails = await books;
    res.send(bookDetails[ISBN])
 });
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
    let author = req.params.author;
    let filteredBooks = [];
  
    await Object.keys(books).forEach(function(key) {
      if (books[key].author === author) {
        filteredBooks.push(books[key]);
      }
    });
    return res.send(filteredBooks);
});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
    let title = req.params.title;
    let filteredBooks = [];
  
    await Object.keys(books).forEach(function(key) {
      if (books[key].title === title) {
        filteredBooks.push(books[key]);
      }
    });
    return res.send(filteredBooks);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const ISBN = req.params.isbn;
  const book = books[ISBN];
  const review = book.review;
  return res.send(JSON.stringify(review))
});

module.exports.general = public_users;
