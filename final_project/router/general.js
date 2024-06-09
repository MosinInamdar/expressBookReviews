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

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  const allbooks = await getAllBooks();
  return res.send(JSON.stringify(allbooks, null, 4));
  
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    const targetISBN = parseInt(req.params.isbn);
    const targetBook = await books[targetISBN];
    if (!targetBook) {
      return res.status(404).json({ message: "ISBN not found." });
    } else {
      return res.status(200).json(targetBook);
    }
 });
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    const matchingBooks = Object.values(await books).filter(
        (book) => book.author.toLowerCase() === req.params.author.toLowerCase()
      );
      if (matchingBooks.length > 0) {
        return res.status(200).send(JSON.stringify(matchingBooks, null, 4));
      } else {
        return res.status(404).json({ message: "No books by that author." });
      }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    const matchingTitle = Object.values(await books).filter(
        (book) => book.title.toLowerCase() === req.params.title.toLowerCase()
      )[0];
      if (matchingTitle) {
        return res.status(200).json(matchingTitle);
      } else {
        return res.status(404).json({ message: "Title not found." });
      }
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
