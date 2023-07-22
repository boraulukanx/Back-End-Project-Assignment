const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "Customer successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "Customer with same username already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register customer."});
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  res.send(JSON.stringify(books, null, 4));
  return res.status(300).json({ message: "Here are all the books" });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn]);
  return res.status(300).json({ message: "Yet to be implemented" });
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
    let bookAuthors = [];
    let bookISBNS = Object.keys(books);
    bookISBNS.forEach((isbn) => {
        if(books[isbn]["author"] === req.params.author){
            bookAuthors.push({"isbn":isbn, "title":books[isbn]["title"], "reviews":books[isbn]["reviews"]});
        }
    })
    res.send(JSON.stringify({bookAuthors}, null, 4));
  return res.status(300).json({ message: "Successfully done" });
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
    let bookTitles = [];
    let bookISBNS = Object.keys(books);
    bookISBNS.forEach((isbn) => {
        if(books[isbn]["title"] === req.params.title){
            bookTitles.push({"isbn":isbn, "author":books[isbn]["author"], "reviews":books[isbn]["reviews"]});
        }
    })
    res.send(JSON.stringify({bookTitles}, null, 4));
  return res.status(300).json({ message: "Successfully done" });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn]["reviews"])
  return res.status(300).json({ message: "Yet to be implemented" });
});

public_users.get('/books',function (req, res) {
    const bookList = new Promise((resolve, reject) => {
        resolve(res.send(JSON.stringify({books}, null, 4)));
      });
      bookList.then(() => console.log("Successfully listed"));
  });

  public_users.get('/books/isbn/:isbn',function (req, res) {
    const getBooksByISBN = new Promise((resolve, reject) => {
    const isbn = req.params.isbn;
        if (req.params.isbn <= 10) {
            resolve(res.send(books[isbn]));
        }else {
            reject(res.send('Not found'));
        }
    });
    getBooksByISBN.then(function(){
        console.log("Successfully done");
   }).catch(function () { 
        console.log('Something went wrong');
  });
});

public_users.get('/books/author/:author',function (req, res) {
    const getBooksByAuthor = new Promise((resolve, reject) => {
    let bookAuthors = [];
    let isbns = Object.keys(books);
    isbns.forEach((isbn) => {
      if(books[isbn]["author"] === req.params.author) {
        bookAuthors.push({"isbn":isbn, "title":books[isbn]["title"],"reviews":books[isbn]["reviews"]});
      resolve(res.send(JSON.stringify({bookAuthors}, null, 4)));
      }
    })
    reject(res.send("Not found"))
    })
    getBooksByAuthor.then(function(){
            console.log("Successfully done");
   }).catch(function () { 
            console.log('Something went wrong');
  });
  });

  public_users.get('/books/title/:title',function (req, res) {
    const getBooksByTitle = new Promise((resolve, reject) => {
    let bookTitles = [];
    let isbns = Object.keys(books);
    isbns.forEach((isbn) => {
      if(books[isbn]["title"] === req.params.title) {
        bookTitles.push({"isbn":isbn, "author":books[isbn]["author"], "reviews":books[isbn]["reviews"]});
    resolve(res.send(JSON.stringify({bookTitles}, null, 4)));
      }
    });
    reject(res.send("Not found"))
       });
       getBooksByTitle.then(function(){
            console.log("Successfully done");
   }).catch(function () { 
                console.log('Something went wrong');
  });
  });



module.exports.general = public_users;
