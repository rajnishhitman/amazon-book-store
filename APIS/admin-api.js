const exp = require("express")
const adminApi = exp.Router();
const expressErrorHandler = require("express-async-handler");
// const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

adminApi.use(exp.json())


adminApi.post("/login",expressErrorHandler(async(req,res,next)=>{
    let admincollectionObject = req.app.get("admincollectionObject")
    let credentials = req.body;

    //verify username
    let user = await admincollectionObject.findOne({username:credentials.username})

    //if user is not existed
    if(user === null){
        res.send({message: "Invalid username"})
    }
    //if user is existed
    else{
        //compare password
        // let result = await bcryptjs.compare(credentials.password, user.password)
        // console.log("result is", result)
        //if password not matched
        if(credentials.password !== user.password){
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



//export
module.exports = adminApi;