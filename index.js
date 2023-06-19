require("dotenv").config();

const express = require("express");
const database = require("./database/database");//DATABASE
const mongoose = require("mongoose");

const BookModel = require("./database/books");
const AuthorModel = require("./database/author");
const PublicationModel = require("./database/publications");

var bodyParser = require("body-parser");
const exp = express();

exp.use(bodyParser.urlencoded({extended : true}));
exp.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URL).then(()=>console.log("connection established"));

/*
Route                /
Description          Get all books
Access               Public
Parameter            NONE
Methods              GET
*/
exp.get("/" , async(req,res) => {

    const getAllBooks = await BookModel.find(); 
    return res.json(getAllBooks);
})

/*
Route                /
Description          ADD A books
Access               Public
Parameter            NONE
Methods              POST
*/
exp.post("/book/new" , async (req,res) => {
    const {newBook} = req.body;
    const AddNewBook = BookModel.create(newBook);
    
    return res.json({
        book: newBook,
        message: "The book has been added!!!"
    })
})

/*
Route                /
Description          Add an author
Access               Public
Parameter            NONE
Methods              POST
*/
exp.post("/author/add" , async (req,res) => {
    const {newAuthor} = req.body;
    const addNewAuthor = AuthorModel.create(newAuthor)
   
    return res.json({
        author : newAuthor,
        message: "the author has been added!!!!"
    });
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
// exp.delete("/book/delete/:isbn", (req,res) => {
//     const updatedBook = database.books.filter((book) => {
//         book.ISBN !== req.params.isbn;
//     })
//     database.books = updatedBook;
//     return res.json({books: database.books});
// })

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
exp.get("/is/:isbn",async (req,res) => {
    const getSpecificBook = await BookModel.findOne({ISBN: req.params.isbn});

    if(!getSpecificBook)
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
exp.get("/cat/:category" , async (req,res) => {
    const getSpecificBook = await BookModel.findOne({categories: req.params.category});

    if(!getSpecificBook)
    {
        return res.json({error: `No book found with this category ${req.params.category}`});
    }
    else {
        return res.json({book: getSpecificBook});
    }
})

/*
Route                /lang
Description          Get list of books with language
Access               Public
Parameter            language
Methods              GET
*/
exp.get("/lang/:ln" , async (req , res) => {
    const getSpecificBook = await BookModel.findOne({language: req.params.ln});

    if(!getSpecificBook)
    {
        return res.json({error: `No book found with this language  ${req.params.ln}`});
    }
    else {
        return res.json({book: getSpecificBook});
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
exp.get("/author", async(req,res ) =>{
    const getAllauthors = await AuthorModel.find();
    return res.json(getAllauthors);
})

/*
Route                /publication
Description          Get all publicatons
Access               Public
Parameter            NONE
Methods              GET
*/
exp.get("/publication" , async(req,res) => {
    const getAllpublications = await PublicationModel.find();
    return res.json(getAllpublications);
})

/*
Route                /publication/add
Description          Add a publication
Access               Public
Parameter            NONE
Methods              POST
*/
exp.post("/publication/add", async(req,res) => {
    const {newPublication} = req.body;
    const addNewPublication = PublicationModel.create(newPublication);
    return res.json({
        publication : addNewPublication,
        message: "The publication has been added!!!"
    });
})

/*
Route                /book/update/
Description          update book title
Access               Public
Parameter            NONE
Methods              PUT
*/
exp.put("/book/update/:isbn" , async(req,res) => {
    const updatedBook = await BookModel.findOneAndUpdate(
        {
            ISBN: req.params.isbn
        },
        {
            title: req.body.bookTitle
        },
        {
            new: true
        }
    )
    return res.json({
        Book: updatedBook , 
        message: " the book has been updated"
    })

})

/*
Route                /author/update/:isbn
Description          update book author and author with the respective book
Access               Public
Parameter            isbn
Methods              PUT
*/
exp.put("/author/update/:isbn" , async (req,res) => {
    //update the book coll
    const updatedBook = await BookModel.findOneAndUpdate(
        {
            ISBN: req.params.isbn
        },
        {
            $addToSet: {
            authors: req.body.newAuthor
            }
        },
        {
            new: true
        }
    );

    //update the author coll
    const updatedAuthor =  await AuthorModel.findOneAndUpdate(
        {
            id: req.body.newAuthor
        },
        {
            $addToSet: {
                books: req.params.isbn
            }
        },
        {
            new: true
        }
    );

    return res.json({
        books: updatedBook,
        author: updatedAuthor,
        message: " The author has been updated"
    });

});

/*
Route                /book/delete
Description          delete the book from the database
Access               Public
Parameter            isbn
Methods              delete
*/

exp.delete("/book/delete/:isbn" , async (req,res) => {
    const bookToBeDeleted = await BookModel.findOneAndDelete(
        {
            ISBN: req.params.isbn
        }
    )
    return res.json({
        books: bookToBeDeleted,
        message: "The book is deleted from the database"
    })
})


exp.listen(3000 , () => {
    console.log("The server is up and running ");
})
