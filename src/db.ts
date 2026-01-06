import mongoose, {model,Schema} from "mongoose";
mongoose.connect("mongodb://localhost:27017/")

const userSchema = new Schema({
    username: {type: String,unique:true},
    password : String,
})

const contentSchema = new Schema({
    title:String,
    link:String,
    tags:[{type:mongoose.Types.ObjectId, ref:'Tag'}],
    userId:{type:mongoose.Types.ObjectId,ref:'User',required:true},
    
})


export const userModel = model("User",userSchema)
export const contentModel = model("Content",contentSchema)