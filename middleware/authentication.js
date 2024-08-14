// middleware to verify the token
const User=require('../models/User')
const jwt=require('jsonwebtoken')
const {UnauthenticatedError}=require('../errors')

const auth=async(req,res,next)=>{
    //check header
    const authHeader=req.headers.authorization

    if(!authHeader || !authHeader.startsWith('Bearer')){
        throw new UnauthenticatedError('Authentication Invalid')
    }

    const token=authHeader.split(' ')[1] //2nd element of string 

    try{
        const payload=jwt.verify(token,process.env.JWT_SECRET)
        //attach user to the job routes
        req.user={userId:payload.userId, name:payload.name}
        next()
    }
    catch(error){
        throw new UnauthenticatedError('Authentication invalid')
    }
    
    //now we pass along the user to the job routes but where to use?
    // we awant to authenticate all the routes, so use it in jobs router (app.js)
}
module.exports=auth



// const User=require('../models/User')
// const jwt= require('jsonwebtoken')
// const {UnauthenticatedError}=require('../errors')

// const auth = async (req,res,next) =>{
//     // check header
//     const authHeader=req.headers.authentication
    
//     if(!authHeader || !authHeader.startsWith('Bearer')){
//         throw new UnauthenticatedError('Authentication Invalid')
//     }
//     const token=authHeader.split(' ')[1]

//     try{
//         const payload=jwt.verify(token,process.env.JWT_SECRET)
//         //attach user to the job routes
//         req.user={userId:payload.userID, name:payload.name}
//         next()
//     }
//     catch(error){
//         throw new UnauthenticatedError('Authorization Invalid')
//     }
// }
// module.exports=auth;
