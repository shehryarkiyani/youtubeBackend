import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
 const RegisterUser =asyncHandler(async(req,res)=>{
    const {fullName,email,username,password} = req.body
    if([fullName,email,username,password].some((field)=>field?.length===0)){
        throw new ApiError(400,"All Fields are Required")
    }else{
      const existedUser= await User.findOne({
        $or:[{username},{email}]
        })
        if(existedUser){
            throw new ApiError(409,"User Already Exist")
        }else{
            const avatarLocalPath=req.files?.avatar[0]?.path
            const coverImageLocalPath = req.files?.coverImage[0]?.path
            if(!avatarLocalPath){
                throw new ApiError(400,"Avatar File is required")
            }else{
                const avatar = await uploadOnCloudinary(avatarLocalPath)
                const coverImage = await uploadOnCloudinary(coverImageLocalPath)
                if(!avatar){
                    throw new ApiError(400,"Avatar File is required")
                }
             let user=  await User.create({
                    fullName,
                    avatar:avatar.url,
                    coverImage:coverImage.url || "",
                    email,
                    password,
                    username:username.toLowerCase()
                })
                const createduser = await User.findById(user._id).select("-password -refreshToken")
                if(!createduser){
                    throw new ApiError(500,"Something went wrong while registering user")
                }else{
                    return res.status(201).json(new ApiResponse(200,createduser,"User Registered Successfully"))
                }
            }
        }
    }
    
})
const GetUserById = asyncHandler(async(req,res)=>{
    const {id} = req.params
    const response = await User.findOne({_id:id})
    if(response){
        return  res.status(201).json(new ApiResponse(200,response,"User Get Successfully"))
    }else{
        throw new ApiError(500,"User Not found ")
    }
})

export {RegisterUser,GetUserById}