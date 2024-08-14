const mongoose=require('mongoose')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Please provide your name'],
        minlength:3,
        maxlength:50,
    },
    email:{
        type:String,
        required:[true,'Please provide your email'],
        match:[
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide valid email',
        ],
        unique:true, //it creates an unique index to save user but if there already exists email it give duplicate error
    },
    password:{
        type:String,
        required:[true,'Please provide password'],
        minlength:6,
        //maxlength:12, // remove maxlength later once we have hash our password
        //if we store password in string and if someone breaks into our database all users life ruined, hash ->generating random bytes and combining it with password , we will be using bcyptjs library
    },
})
//hashing password using mongoose middleware 
//middleware function using Mongoose middleware to perform an operation before saving a user document to the database.
//In mongoose 5.x, instead of calling next() manually, you can use a function that returns a promise. In particular, you can use async/await.

userSchema.pre('save',async function(next){     //This line registers a middleware function to be executed before the "save" event of the user schema 
    
    const salt =await bcrypt.genSalt(10)
    this.password=await bcrypt.hash(this.password,salt)
    next()
})

userSchema.methods.createJWT=function(){
    return jwt.sign({userId:this._id, name: this.name},process.env.JWT_SECRET,{expiresIn:process.env.JWT_LIFETIME})
    // return jwt.sign({userId:this._id, name: this.name},'jwtSecret',{expiresIn:'30d'})
}

userSchema.methods.comparePassword = async function (canditatePassword) {
    const isMatch = await bcrypt.compare(canditatePassword, this.password)
    return isMatch
  }

module.exports=mongoose.model('User',userSchema)