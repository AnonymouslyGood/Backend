import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import { upload } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const genereteAcessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false})

        return {accessToken, refreshToken}
    } catch (error) {
        throw new ApiError(500, "Something went wrong")
    }
}

const registerUser = asyncHandler(async (req, res) => {
    // get user details from front end
    // validation -> not empty
    // check if the user is registered
    // check for images, check for avatar
    // upload them to cloudinary

    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res


    const {fullName, email, username, password} = req.body

    if(
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ){
        throw new ApiError(400, "All Fields are required")
    }


    const existedUser = await User.findOne({
        $or: [{email}, {username}]
    })

    if(existedUser){
        throw new ApiError(409, "Email or Username already in use")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path

    const coverImageLocalPath = req.files?.coverImage[0]?.path

    if(avatarLocalPath === ""){
        throw new ApiError(400, "Avatar is missing")
    }


    const avatar = await upload(avatarLocalPath)

    const coverImage = await upload(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(400, "Avatar upload failed")
    }

    if(!coverImage){
        console.log("SHIT!")
    }


    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const isCreated = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!isCreated){
        throw new ApiError(500, "User Creation failed")
    }

    return res.status(201).json(
        new ApiResponse(200, isCreated, "User registered successfully")
    )

});

const loginUser = asyncHandler( async(req, res) => {
    //Todos

    // req -> body = data
    // username or email
    // find the user
    // password check
    // access and refresh token
    // send cookie

    const {email, username, password} = req.body;

    if(password == "" || (!username && !email)){
        throw new ApiError(400, "Fill the required fields")
    }

    const existedUser = User.findOne({
        $or: [{email}, {username}]
    })

    if(!existedUser){
        throw new ApiError(404, "User does not exist")
    }

    const isPasswordValid = await existedUser.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(401, "Password does not match")
    }

    const {accessToken, refreshToken} = await genereteAcessAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpsOnly: true,
        secure: true
    }

    return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,{
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged in successfully"
        )
    )
})

const logoutUser = asyncHandler( async (req, res) => {
    // Todos

    //Clear Cookies
    //Clear refresh token

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {refreshToken: undefined}
        },{
            new: true
        }
    )

    const options = {
        httpsOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"))

})

export { registerUser, loginUser, logoutUser };
