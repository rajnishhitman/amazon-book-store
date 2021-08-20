const exp = require('express')
const booksApi = exp.Router();
const expressErrorHandler = require("express-async-handler");
var ObjectID = require('mongodb').ObjectId;
const multerObj = require("./middlewares/configCloudinary")


// express.json() is a middleware to recognize the incoming Request Object as a JSON Object
booksApi.use(exp.json())



//Create book
booksApi.post("/addbook/:userid", multerObj.single('photo'), expressErrorHandler(async(req,res,next) =>{
    let bookscollectionObject = req.app.get("bookscollectionObject")
    //get book obj
    let newBook = JSON.parse(req.body.bookObj);

    //add CDN link of image
    newBook.Image = req.file.path;
    //add userId of user who is adding the book
    newBook.userid = req.params.userid;
    //add date on which book is added
    const d = new Date();
    newBook.Year = d.getFullYear();
    newBook.Month = d.getMonth();
    newBook.Day = d.getDate();
    newBook.rateCnt = 0
    newBook.avgRate = 0
    // newBook.reviewANDrating = []
    //insert user
    await bookscollectionObject.insertOne(newBook)
    res.send({message: "BOOK ADDED"})
}))


//read all books
booksApi.get("/getbooks", expressErrorHandler(async(req,res,next) =>{

    let bookscollectionObject = req.app.get("bookscollectionObject")

    let booksList = await bookscollectionObject.find().toArray();
    res.send({message: booksList})

}))


//read logged in user's books
booksApi.get("/getuserbooks/:userid", expressErrorHandler(async(req,res,next) =>{

    let bookscollectionObject = req.app.get("bookscollectionObject")

    let userid = req.params.userid;

    let booksList = await bookscollectionObject.find({userid: userid}).toArray();
    res.send({message: booksList})

}))


//read book by id
booksApi.get("/getbook/:bookid", expressErrorHandler(async(req,res,next) =>{

    let bookscollectionObject = req.app.get("bookscollectionObject")
    //get bookname from url params
    let bookid = req.params.bookid;

    let book = await bookscollectionObject.findOne({_id: ObjectID(bookid)})
    res.send({message: book})

}))


//update book
booksApi.put("/updatebook/:bookid",(req,res,next)=>{
    let bookscollectionObject = req.app.get("bookscollectionObject")
    //get bookid from url params
    let bookid = req.params.bookid;
    // console.log(bookid)

    let modifiedbook = req.body.book;
    // modifiedbook.Image = req.file.path;
    bookscollectionObject.findOne({_id: ObjectID(bookid)})
        .then(bookObj =>{
            if(bookObj === null){
                res.send({message: "book not existed for update"})
            }
            else{
                bookscollectionObject.updateOne({_id: ObjectID(bookid)},
                    {$set:{
                        bookName:modifiedbook.bookName,
                        bookAuthor:modifiedbook.bookAuthor,
                        bookPrice:modifiedbook.bookPrice
                    }})
                    .then((success)=>{
                        res.send({message: "BOOK UPDATED"})
                    })
                    .catch(err => res.send(err.message))
            }
        })
})


//delete book by promises
booksApi.delete("/deletebook/:bookid",expressErrorHandler(async(req,res,next)=>{
    let bookscollectionObject = req.app.get("bookscollectionObject")
    //get bookid from url params
    let bookid = req.params.bookid;

    //find book
    let bookObj = await bookscollectionObject.findOne({_id: ObjectID(bookid)})

    if(bookObj === null){
        res.send({message: "book not existed"})
    }
    else{
        await bookscollectionObject.deleteOne({_id: ObjectID(bookid)})
        res.send({message: "BOOK DELETED"})
    }
}))



//rate the book
booksApi.put("/ratebook/:rate/:bookid",expressErrorHandler(async(req,res,next)=>{
    let bookscollectionObject = req.app.get("bookscollectionObject")
    let rate = req.params.rate;
    let bookid = req.params.bookid;

    let bookObj = await bookscollectionObject.findOne({_id: ObjectID(bookid)})

    if(bookObj.rateCnt != 0){
        var avgRate = Math.ceil(((bookObj.avgRate * bookObj.rateCnt) + parseInt(rate))/(bookObj.rateCnt+1))
        var rateCnt = bookObj.rateCnt+1
    }
    else{
        var avgRate = parseInt(rate)
        var rateCnt = 1
    }
    await bookscollectionObject.updateOne({_id: ObjectID(bookid)}, {$set: {avgRate: avgRate, rateCnt: rateCnt}})
    // await bookscollectionObject.insertOne(bookObj)
    res.send({message: "Rating Added"})
}))



//add review and rating
booksApi.post("/rateAndreview/:bookid",expressErrorHandler(async(req,res,next)=>{
    let bookscollectionObject = req.app.get("bookscollectionObject")
    let reviewObj = req.body;
    let bookid = req.params.bookid;

    let bookObj = await bookscollectionObject.findOne({_id: ObjectID(bookid)})
    if(bookObj.reviewANDrating){
        // console.log("reviewed")
        bookObj.reviewANDrating.push(reviewObj)
        await bookscollectionObject.updateOne({_id: ObjectID(bookid)}, {$set: {reviewANDrating: bookObj.reviewANDrating}})
        res.send({message: "Review and Rating Added"})
    }
    else{
        // console.log("not reviewed")
        var reviewANDrating = []
        reviewANDrating.push(reviewObj)
        await bookscollectionObject.updateOne({_id: ObjectID(bookid)}, {$set: {reviewANDrating: reviewANDrating}})
        res.send({message: "Review and Rating Added"})
    }
}))



module.exports = booksApi;