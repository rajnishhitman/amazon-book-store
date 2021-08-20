const exp = require('express')
const orderApi = exp.Router();
const expressErrorHandler = require("express-async-handler");
var ObjectID = require('mongodb').ObjectId;

orderApi.use(exp.json())



//get logged in user's ordered books
orderApi.get("/userorder/:username",expressErrorHandler(async(req, res) => {
    let userOrderCollectionObject = req.app.get("userordercollectionObject")

    //get logged in user 
    let loggedUser = req.params.username;

    let totalPrice = 0


    //find user in userordercollection
    let userOrders = await userOrderCollectionObject.find({username: loggedUser}).toArray();


    if(userOrders!= null){
        res.send({message: userOrders})
    }
    else{
        res.send({message: "Nothing Ordered"})
    }
}))


//return the ordered book
orderApi.delete("/returnbooks/:username",expressErrorHandler(async(req, res) => {
    let userOrderCollectionObject = req.app.get("userordercollectionObject")

    //get logged in user 
    let loggedUser = req.params.username;

    await userOrderCollectionObject.deleteOne({username: loggedUser})
    res.send({message: "Return Initiated"})
}))



//Place the order
orderApi.put("/placeorder/:username",expressErrorHandler(async(req, res) => {
    let userCartCollectionObject = req.app.get("usercartcollectionObject")
    let userOrderCollectionObject = req.app.get("userordercollectionObject")


    //get logged in user 
    let loggedUser = req.params.username;
    // let addressObj = req.params.addressObj;
    let addressObj = req.body; 

    let userCartObj = await userCartCollectionObject.findOne({username: loggedUser})
    let userOrderObj = {username: userCartObj.username, books: userCartObj.books, address: addressObj}


    await userOrderCollectionObject.insertOne(userOrderObj)

    //delete user in usercartcollection
    await userCartCollectionObject.deleteOne({username: loggedUser})
    res.send({message: "Order Successfull", bookCnt: 0})
}))



module.exports = orderApi;