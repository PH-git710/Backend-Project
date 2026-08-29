import { asyncHandler } from "../utils/asyncHandler.js"; 
import { ApiError } from "../utils/ApiError.js"; 
import { User  } from "../models/user.model.js"; // Renamed to avoid collisions
import { uploadOnCloudinary } from "../utils/cloudinary.js"; 
import { ApiResponse } from "../utils/ApiResponse.js"; 
import {upload} from "../middlewares/multer.middleware.js";

const registerUser = asyncHandler(async (req, res) => {
    // 1. Get user details and validate
    const { fullName, email, username, password } = req.body; 

    if ([fullName, email, username, password].some((field) => field?.trim() === "")) { 
        throw new ApiError(400, "All fields are required"); 
    } 

    // 2. Check if user already exists (Added await)
    const existentUser = await User.findOne({ 
        $or: [{ username }, { email }] 
    }); 

    if (existentUser) { 
        throw new ApiError(409, "User with email or username already exists"); 
    } 

    // 3. Handle file paths (Fixed typos from avater -> avatar)
    const avatarLocalPath = req.files?.avatar?.[0]?.path; 
    //const coverImageLocalPath = req.files?.coverImage?.[0]?.path; 
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
        coverImageLocalPath = req.files.coverImage[0].path
       
    }

    if (!avatarLocalPath) { 
        throw new ApiError(400, "Avatar file is required"); 
    } 

    // 4. Upload to Cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath); 
    const coverImage = coverImageLocalPath ? await uploadOnCloudinary(coverImageLocalPath) : null; 

    if (!avatar) { 
        throw new ApiError(400, "Avatar upload failed"); 
    } 

    // 5. Create user entry in database
    const newUser = await User.create({ 
        fullName, 
        avatar: avatar.url, 
        coverImage: coverImage?.url || "", 
        email, 
        password, 
        username: username.toLowerCase(), 
    }); 

    // 6. Verify creation and remove sensitive fields
    const createdUser = await User.findById(newUser._id).select("-password -refreshToken"); 

    if (!createdUser) { 
        throw new ApiError(500, "Something went wrong while registering the user"); 
    } 

    // 7. Return success response
    return res.status(201).json( 
        new ApiResponse(201, createdUser, "User registered successfully") 
    ); 
}); // Function accurately closes here now

export { registerUser };

