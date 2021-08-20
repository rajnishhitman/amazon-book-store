const exp = require('express')
const cartApi = exp.Router();
const expressErrorHandler = require("express-async-handler");
var ObjectID = require('mongodb').ObjectId;

cartApi.use(exp.json())

//add to cart
cartApi.post("/addtocart", expressErrorHandler(async(req,res,next)=>{
    let userCartCollectionObject = req.app.get("usercartcollectionObject")
    let bookscollectionObject = req.app.get("bookscollectionObject")

    //get user cart obj
    let userCartObj = req.body;

    let bookObj = await bookscollectionObject.findOne({_id: ObjectID(userCartObj.bookObj._id)})
    if(bookObj.numberOfBooks > 0){
        //find user in usercartcollection
        let userInCart = await userCartCollectionObject.findOne({username: userCartObj.username})

        let flag = 0
        //if user not existed in cart
        if(userInCart == null){
            //new usercartObject
            let books = [];
            userCartObj.bookObj.bookQuantity = 1
            books.push(userCartObj.bookObj)
            let newUserCartObject = {username: userCartObj.username, books: books}

            //insert
            await userCartCollectionObject.insertOne(newUserCartObject)
            res.send({message: "Book added to cart", bookCnt: 1})
        }
        //if user already existed in cart
        else{
            userInCart.books.forEach((book) => {
                if(book._id === userCartObj.bookObj._id){
                    book.bookQuantity = book.bookQuantity + 1
                    flag = 1
                }
            })
            if(flag === 0){
                userCartObj.bookObj.bookQuantity = 1
                userInCart.books.push(userCartObj.bookObj)
            }
            let bookCnt = 0
            userInCart.books.forEach((book)=>{
                bookCnt = bookCnt + book.bookQuantity
            })    
            

            //update
            await userCartCollectionObject.updateOne({username: userCartObj.username}, {$set:{...userInCart}})
            res.send({message: "Book added to cart", bookCnt: bookCnt})
        }
        await bookscollectionObject.updateOne({_id: ObjectID(userCartObj.bookObj._id)}, {$set:{numberOfBooks: parseInt(bookObj.numberOfBooks)-1}})
    }
    else{
        let userInCart = await userCartCollectionObject.findOne({username: userCartObj.username})
        let bookCnt = 0
        userInCart.books.forEach((book)=>{
            bookCnt = bookCnt + book.bookQuantity
        })  
        res.send({message: "Book is out of stock", bookCnt: bookCnt})
    }
}))



//increase book to logged in user's cart
cartApi.put("/addbook/:username/:bookid",expressErrorHandler(async(req, res) => {
    let userCartCollectionObject = req.app.get("usercartcollectionObject")
    let bookscollectionObject = req.app.get("bookscollectionObject")

    //get logged in user 
    let loggedUser = req.params.username;
    let bookid = req.params.bookid;

    let bookObj = await bookscollectionObject.findOne({_id: ObjectID(bookid)})
    if(bookObj.numberOfBooks > 0){

        //find user in usercartcollection
        let userCart = await userCartCollectionObject.findOne({username: loggedUser})

        userCart.books.forEach((book)=>{
            if(book._id === bookid){
                book.bookQuantity = book.bookQuantity + 1
            }
        })
        let bookCnt = 0
        userCart.books.forEach((book)=>{
            bookCnt = bookCnt + book.bookQuantity
        })

        //update
        await userCartCollectionObject.updateOne({username: userCart.username}, {$set:{...userCart}})
        await bookscollectionObject.updateOne({_id: ObjectID(bookid)}, {$set:{numberOfBooks: parseInt(bookObj.numberOfBooks)-1}})
        res.send({message: "Book Added to cart", bookCnt: bookCnt})
    }
    else{
        // let loggedUser = req.params.username;
        let userInCart = await userCartCollectionObject.findOne({username: loggedUser})
        let bookCnt = 0
        userInCart.books.forEach((book)=>{
            bookCnt = bookCnt + book.bookQuantity
        })  
        res.send({message: "Book is out of stock", bookCnt: bookCnt})
    }
}))



//remove book from logged in user's cart
cartApi.put("/removebook/:username/:bookid",expressErrorHandler(async(req, res) => {
    let userCartCollectionObject = req.app.get("usercartcollectionObject")
    let bookscollectionObject = req.app.get("bookscollectionObject")

    //get logged in user 
    let loggedUser = req.params.username;
    let bookid = req.params.bookid;

    let bookObj = await bookscollectionObject.findOne({_id: ObjectID(bookid)})

    //find user in usercartcollection
    let userCart = await userCartCollectionObject.findOne({username: loggedUser})

    let bookc = 0
    userCart.books.forEach((book)=>{
        bookc = bookc + book.bookQuantity
    })
    
    if(bookc > 1){
        userCart.books.forEach((book)=>{
            if(book._id === bookid){
                if(book.bookQuantity > 1){
                    book.bookQuantity = book.bookQuantity - 1
                }
                else{
                    let i = userCart.books.indexOf(book)
                    userCart.books.splice(i,1)
                }
            }
        })
        let bookCnt = 0
        userCart.books.forEach((book)=>{
            bookCnt = bookCnt + book.bookQuantity
        })
    
        //update
        await userCartCollectionObject.updateOne({username: userCart.username}, {$set:{...userCart}})
        await bookscollectionObject.updateOne({_id: ObjectID(bookid)}, {$set:{numberOfBooks: parseInt(bookObj.numberOfBooks)+1}})
        res.send({message: "Book Removed from cart", bookCnt: bookCnt})
    }
    else{
        await userCartCollectionObject.deleteOne({_id: ObjectID(userCart._id)})
        await bookscollectionObject.updateOne({_id: ObjectID(bookid)}, {$set:{numberOfBooks: parseInt(bookObj.numberOfBooks)+1}})
        res.send({message: "Book Removed from cart", bookCnt: 0})
    }    
}))


cartApi.get("/cartcnt/:username", expressErrorHandler(async(req,res,next) => {
    let userCartCollectionObject = req.app.get("usercartcollectionObject")
    //get username from url params
    let username = req.params.username;

    let userCart = await userCartCollectionObject.findOne({username: username})
    if(userCart == null){
        res.send({message: 0})
    }
    else{
        let cartCnt = 0
        userCart.books.forEach((book) => {
            cartCnt = cartCnt + book.bookQuantity
        })
        res.send({message: cartCnt})
    }
}))


//get logged in user's cart books
cartApi.get("/usercart/:username",expressErrorHandler(async(req, res) => {
    let userCartCollectionObject = req.app.get("usercartcollectionObject")

    //get logged in user 
    let loggedUser = req.params.username;

    let totalPrice = 0


    //find user in usercartcollection
    let userCart = await userCartCollectionObject.findOne({username: loggedUser})


    if(userCart!= null){
        userCart.books.forEach((book) => {
            totalPrice = totalPrice + (parseInt(book.bookPrice) * parseInt(book.bookQuantity))
        }) 
        res.send({message: userCart.books, totalPrice: totalPrice})
    }
    else{
        res.send({message: "Empty Cart"})
    }
}))


module.exports = cartApi;