const exp = require('express')
const userApi = exp.Router();
const expressErrorHandler = require("express-async-handler");
const multerObj = require("./middlewares/configCloudinary")



const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
var ObjectID = require('mongodb').ObjectId;


userApi.use(exp.json())


//create user
userApi.post("/createuser", multerObj.single('photo'), expressErrorHandler(async(req,res,next) =>{
    let usercollectionObject = req.app.get("usercollectionObject")
    //get user obj
    //Use the JavaScript function JSON.parse() to convert text into a JavaScript object
    let newUser = JSON.parse(req.body.userObj); 

    //search for user
    let user = await usercollectionObject.findOne({username:newUser.username})

    //if user is existed
    if(user!=null){
        res.send({message:"user already existed"})
    }
    else{
        //hash the password
        let hashedPassword = await bcryptjs.hash(newUser.password, 7)
        //replace plain pw with hashedPassword
        newUser.password = hashedPassword;
        //add CDN link of image
        newUser.profileImage = req.file.path;
        //insert user
        await usercollectionObject.insertOne(newUser)
        res.send({message: "User created"})
    }

}))

//read users
userApi.get("/getusers", expressErrorHandler(async(req,res,next) => {
    let usercollectionObject = req.app.get("usercollectionObject")

    let usersList = await usercollectionObject.find().toArray();
    if(usersList !== null){
        res.send({message: usersList})
    }
    else{
        res.send({message: "No Users"})
    }
}))


//read user by userid
userApi.get("/getuser/:userid", expressErrorHandler(async(req,res,next) => {
    let usercollectionObject = req.app.get("usercollectionObject")

    //get userid from url params
    let userid = req.params.userid;

    let user = await usercollectionObject.findOne({_id: ObjectID(userid)});
    // let user = await usercollectionObject.findOne({username: username});
    res.send({message: user})
}))

//update user
userApi.put("/edituser/:userid",multerObj.single('photo'),(req,res,next) => {
    let usercollectionObject = req.app.get("usercollectionObject")

    //get userid from url params
    let userid = req.params.userid;

    let modifieduser = JSON.parse(req.body.userObj); 
    modifieduser.profileImage = req.file.path;
    modifieduser._id = userid;

    usercollectionObject.updateOne({_id: ObjectID(userid)},
        {$set:{
            username:modifieduser.username,
            email:modifieduser.email,
            dob:modifieduser.dob,
            profileImage:req.file.path
        }})
        .then((success)=>{
            res.send({message: "USER EDITED", modifieduser: modifieduser})
        })
        .catch(err => res.send(err.message))
})


//delete user
userApi.delete("/deleteuser/:userid",expressErrorHandler(async(req,res,next)=>{
    let usercollectionObject = req.app.get("usercollectionObject")
    //get username from url params
    let userid = req.params.userid;

    await usercollectionObject.deleteOne({_id: ObjectID(userid)})
    res.send({message: "USER DELETED"})
}))



userApi.post("/login",expressErrorHandler(async(req,res,next)=>{
    let usercollectionObject = req.app.get("usercollectionObject")
    let credentials = req.body;

    //verify username
    let user = await usercollectionObject.findOne({username:credentials.username})

    //if user is not existed
    if(user == null){
        res.send({message: "Invalid username"})
    }
    //if user is existed
    else{
        //compare password
        let result = await bcryptjs.compare(credentials.password, user.password)
        // console.log("result is", result)
        //if password not matched
        if(result === false){
            res.send({message: "Invalid password"})
        }
        //if password matched
        else{
            //create a token and send it as res
            let token = await jwt.sign({username:credentials.username},'abcdef',{expiresIn:"10"})

            //remove password from user
            delete user.password; 
            
            // console.log("token is ",token)
            res.send(({message: "login-success", token:token, username:credentials.username, userObj: user}))
        }
    }
}))




module.exports = userApi;