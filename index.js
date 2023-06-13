const express = require("express");
var bodyParser = require("body-parser");
const exp = express();

exp.use(bodyParser.urlencoded({extended : true}));
exp.use(bodyParser.json());

//DATABASE
const database = require("./database");

/*
Route                /
Description          Get all books
Access               Public
Parameter            NONE
Methods              GET
*/
exp.get("/" , (req,res) => {
    return res.json({books : database.books});
})

/*
Route                /
Description          ADD A books
Access               Public
Parameter            NONE
Methods              POST
*/
exp.post("/book/new" , (req,res) => {
    const newBook = req.body;
    database.books.push(newBook);
    return res.json({updatedBooks: database.books});
})

/*
Route                /
Description          Add an author
Access               Public
Parameter            NONE
Methods              POST
*/
exp.post("/author/add" , (req,res) => {
    const newAuthor = req.body;
    database.authors.push(newAuthor);
    return res.json({updateAuthors: database.authors});
})

/*
Route                /publication/update/
Description          Add book to a publication
Access               Public
Parameter            ISBN
Methods              PUT
*/
exp.put("/publication/update/:isbn" , (req,res) => {
    database.plublications.forEach((pub) => {
        if(pub.id === req.body.pubid){
            return pub.books.push(req.params.isbn);
        } 
    })

    database.books.forEach((book) => {
        if(book.ISBN === req.params.isbn)
        {
            book.plublications = req.body.pubid;
            return;
        }
    })

    const getSpecificBook = database.books.filter(
        (book) => book.ISBN === req.params.isbn 
    );

    const getSpecificPublication = database.plublications.filter(
        (pub) => pub.id === req.body.pubid 
    );

    return res.json({updatedBook: getSpecificBook,
        updatedPublication: getSpecificPublication,
        message : "The book is updated successfully"}
        )
})

/*
Route                /book/delete
Description          delete a specific book
Access               Public
Parameter            isbn
Methods              delete
*/
exp.delete("/book/delete/:isbn", (req,res) => {
    const updatedBook = database.books.filter((book) => {
        book.ISBN !== req.params.isbn;
    })
    database.books = updatedBook;
    return res.json({books: database.books});
})

/*
Route                /book/delete/author
Description          delete an author from a particular book
Access               Public
Parameter            isbn
Methods              delete
*/
exp.delete("/book/delete/author/:isbn/:authorId" , (req,res) => {
    //update the books
    database.books.forEach((book) => {
        if(book.ISBN === req.params.isbn)
        {
            const updatedAuthor = book.authors.filter((auth) => {
                auth !==req.params.authorId;
            })
            book.authors = updatedAuthor;
            return;
        }
    })

    //update the author
    database.authors.forEach((author) => {
        if(author.id === req.params.authorId)
        {
            const updatedBook = author.books.filter((book) => {
                book !== req.params.isbn
            })
            author.books = updatedBook;
            return;
        }
    })

    return res.json({
        book: database.books,
        authors: database.authors,
        message: "Deleted Successfully"
    })
})

/*
Route                /is
Description          Get specific book
Access               Public
Parameter            isbn
Methods              GET
*/
exp.get("/is/:isbn",(req,res) => {
    const getSpecificBook = database.books.filter(
        (book) => book.ISBN === req.params.isbn 
    );

    if(getSpecificBook.length === 0)
    {
        return res.json({error: `No book found with the isbn ${req.params.isbn}`});
    }
    else {
        return res.json({book: getSpecificBook});
    }
})

/*
Route                /cat
Description          Get list of books with category
Access               Public
Parameter            category
Methods              GET
*/
exp.get("/cat/:category" , (req,res) => {
    const getBooksByCat = database.books.filter(
        (book) => book.categories.includes(req.params.category)
        );

        if(getBooksByCat.length === 0)
        {
            return res.json({error: `No book found with the category ${req.params.category}`});
        }
        else{
            return res.json({books: getBooksByCat});
        }
})

/*
Route                /lang
Description          Get list of books with language
Access               Public
Parameter            language
Methods              GET
*/
exp.get("/lang/:ln" , (req , res) => {
    const getBookByLang = database.books.filter(
        (book) => book.language === req.params.ln
    );

    if(getBookByLang.length  === 0){
        return res.json({error: `No book found with the language ${req.params.ln}`});
    }
    else{
        return res.json({books: getBookByLang});
    }
})

/*
Route                /auid
Description          Get list of a particular author
Access               Public
Parameter            author id
Methods              GET
*/
exp.get("/auid/:author" , (req,res) =>{
    const getBooksOfAuthor = database.books.filter(
        (book) => book.authors.includes(req.params.author)
    );

    if(getBooksOfAuthor.length === 0)
    {
        return res.json({error: `No books with the author id ${req.params.author}`})
    }
    else {
        return res.json({books: getBooksOfAuthor})
    }
})

/*
Route                /auid
Description          Get all authors
Access               Public
Parameter            None
Methods              GET
*/
exp.get("/author", (req,res ) =>{
    return res.json({authors: database.authors});
})

/*
Route                /publication
Description          Get all publicatons
Access               Public
Parameter            NONE
Methods              GET
*/
exp.get("/publication" , (req,res) => {
    return res.json({publications: database.plublications});
})

/*
Route                /publication/add
Description          Add a publication
Access               Public
Parameter            NONE
Methods              POST
*/
exp.post("/publication/add", (req,res) => {
    const newPublication = req.body;
    database.plublications.push(newPublication);
    return res.json({updatedPublications: database.plublications});
})


exp.listen(3000 , () => {
    console.log("The server is up and running ");
})
