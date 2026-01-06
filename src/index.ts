import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { contentModel, userModel } from "./db";
import {JWT_PASSWORD} from "./config";
import { userMiddleware } from "./middleware";


const app = express();
app.use(express.json());

app.post("/api/v1/signup", async(req,res)=>{
    const {username,password} = req.body;
    try{
        await userModel.create({
            username:username,
            password:password,
        })
        res.json({
            message:"User signed up successfully"
        })
    } catch(e){
        res.status(411).json({
            message:"User already Exists"
        })
    }
})


app.post("/api/v1/signin", async(req,res)=>{
   //Have to do zod validation
   const {username,password} = req.body;
   const existingUser = await userModel.findOne({
        username,
        password,
   })
   if(existingUser){
        const token = jwt.sign({
            id: existingUser._id
        },JWT_PASSWORD)
        res.json({
            token
        })
    }else{
        res.json({
            message:"Invalid Credentials"
        })
    }
  

})

app.post("/api/v1/content", userMiddleware,async (req,res)=>{
    const {link,title} = req.body;
    // const link = req.body.link;
    // const title = req.body.title;
    await contentModel.create({
        title,
        link,
        //@ts-ignore
        userId : req.userId,
        tags:[]
    })

    return res.json({
        message:"Content added"
    })
})


app.get("/api/v1/content",userMiddleware,  async(req,res)=>{
    //@ts-ignore
    const userId = req.userId;
    const content = await contentModel.find({
       userId : userId,
    }).populate("userId","username")
    res.json({
        content
    })
})


app.delete("/api/v1/content",userMiddleware, async(req,res)=>{
   const contentId = req.body.contentId;
   await contentModel.deleteMany({
    contentId,
    //@ts-ignore
    userId:req.userId
   })
   res.json({
     message:"Deleted Successfully"
   })
   
})
app.get("/api/v1/brain/:shareLink", (req,res)=>{

})

app.listen(3000);