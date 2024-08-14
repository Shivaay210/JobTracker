const mongoose=require('mongoose')

const JobSchema=new mongoose.Schema({
    company:{
        type:String,
        required:[true,'Please provide company name'],
        maxlength:50
    },
    position:{
        type:String,
        required:[true,'Please provide position'],
        maxlength:100
    },
    status:{
        type:String,
        enum:['interview','declined','pending'],
        default:'pending'
    },
    // tie our job to actual user, evertime we create a job we will assign it to one of the users
    createdBy:{
        type:mongoose.Types.ObjectId,
        ref:'User' ,//want to tie job to User model
        required:[true,'Please provide user']
    }
},{timestamps:true}) //createdAt,updatedAt time

module.exports=mongoose.model('Job',JobSchema)