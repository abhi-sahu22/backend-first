import asyncHandler from "../service/asyncHandler";
import CustomError from "../utils/CustomError";
import User from "../models/user.schema.js"

//signup a new user

export const signUp = asyncHandler(async(req, res) => {
    //get data from user
    const {name, email, password} = req.body

    //validation
    if (!name || !email || !password) {
        // throw new Error("Requires fill") ---if no custom error was made
        // If using custom error, then:
        throw new CustomError("Please add all the fields", 400)
    }

    //Lets add this data to the database
    //Finding if the user exists
    const existingUser = await User.findOne({email: email})

    if (existingUser) {
        throw new CustomError("User already exists", 400)
    }

    const user = await User.create ({
        name,
        email,
        password
    })

    const token = user.getJWTtoken()
    //safety
    user.password = undefined

    //send back a response to the user
    res.status(200).json({
        success: true,
        token,
        user
    })

})