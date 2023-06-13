const books = [
    {
        ISBN : "12345book",
        Title : "Tesla",
        Pub_date : "2023-08-05",
        page_num : "250",
        language : "en",
        authors : ["1","2"],
        plublications : "1",
        categories : ["tech" , "space" , "future"]
    }
]

const authors = [
    {
        id : "1",
        name: "Michael",
        books: ["12345book","Secretbook"]
    },
    {
        id : "2",
        name: "Aamir",
        books: ["12345book"], 
    }
]

const plublications = [
    {
        id : "1",
        name: "goodwriter",
        books: ["12345book"]
    },
    {
        id : "3",
        name: "marvel",
        books: []
    }
]

module.exports = { books , authors , plublications};