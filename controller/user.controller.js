import User from "../model/User.model.js"
import crypto from "crypto"
import nodemailer from "nodemailer"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"


const registerUser = async (req, res) => {
    // get data  
    // validate
    // check if user already exists
    // create a user in database
    // create a verification token
    // save token in database
    // send token as email to user
    // send success status to user

    // res.send("hello")
    const { name, email, password } = req.body
    if (!name || !email || !password) {
        return res.status(400).json({
            message: "All fields are required"
        })
    }
    try {
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            })
        }
        const user = await User.create({
            name,
            email,
            password
        })
        console.log(user);

        if (!user) {
            return res.status(400).json({
                message: "User not registered"
            })
        }
        const token = crypto.randomBytes(32).toString("hex")
        console.log(token);
        user.verificationToken = token

        await user.save()

        // send email
        const transporter = nodemailer.createTransport({
            host: process.env.MAILTRAP_HOST,
            port: process.env.MAILTRAP_PORT,
            secure: false, // true for port 465, false for other ports
            auth: {
                user: process.env.MAILTRAP_USERNAME,
                pass: process.env.MAILTRAP_PASSWORD
            },
        });

        const mailOption = {
            from: process.env.MAILTRAP_SENDEREMAIL, // sender address
            to: user.email, // list of receivers
            subject: "Verify your email ", // Subject line
            text: `Please click on the following link 
            ${process.env.BASE_URL}/api/v1/users/verify/${token}
            `
        }
        await transporter.sendMail(mailOption)
        res.status(201).json({
            message: "User registered successfully",
            success: true
        })

    } catch (error) {
        res.status(400).json({
            message: "User not registered",
            error,
            success: false
        })
    }
}
const verifyUser = async (req, res) => {
    // get token from url
    // validate 
    // find user based on token
    // if not
    // set isVerfied field to true
    // remove veriification token
    // save
    // return response
    const { token } = req.params
    console.log(token);
    if (!token) {
        return res.status(400).json({
            message: "Invalid token"
        })
    }
    try {
        const user = await User.findOne({ verificationToken: token })
        if (!user) {
            return res.status(400).json({
                message: "Invalid token"
            })
        }

        user.isVerified = true
        user.verificationToken = undefined
        await user.save()
        res.status(200).json({
            message: "User verified successfully",
            success: true,
        })
    } catch (error) {
        res.status(400).json({
            message: "User not verified",
            error,
            success: false,
        });
    }


}


const login = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(400).json({
            message: "All fields are required"
        })
    }
    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password"
            })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        console.log(isMatch);

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid email or password"
            })
        }
        const token = jwt.sign({ id: user._id, role: user.role },
            process.env.SECRET_KEY, {
            expiresIn: '24h'
        }
        )
        const cookieOptions = {
            httpOnly: true,
            secure: true,
            maxAge: 24 * 60 * 60 * 1000
        }
        res.cookie("token", token, cookieOptions)

        res.status(200).json({
            success: true,
            message: "Login successfull",
            token,
            user: { id: user._id, name: user.name, role: user.role }
        })

    } catch (error) {
        res.status(400).json({
            message: "User not Logged",
            error,
            success: false
        })
    }
}

const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password')
        console.log(user);

        if (!user) {
           return res.status(400).json({
                success: false,
                message: "User not found"
            })
        }
        res.status(200).json({
            success: true,
            user
        })
    } catch (error) {
        res.status(400).json({
            message: "Can't get profile",
            error,
            success: false
        })
    }
}

const logOutUser = async (req, res) => {
    try {
        res.cookie("token", "", {})
        res.status(200).json({
            success: true,
            message: "Logged Out successfully"
        })

    } catch (error) {
        res.status(401).json({
            success: false,
            message: "Logged Out Failed"
        })
    }
}

const forgotPassword = async (req, res) => {
    //get email -- req.body
    // find user based on emaail
    // generate resetpasswordtoken  
    // resetExpiry -- Date.now() +10*60*1000
    // user save()
    // send email to reset password ==> design url
    //

    try {

    } catch (error) {

    }
}

const resetPassword = async (req, res) => {

    // collect token from params
    // password from req.body


    try {
        const { token } = req.params
        const { password } = req.body
        try {
            const user = await User.findOne({
                resetPasswordToken: token,
                resetPasswordExpires: { $gt: Date.now() }
            })

            //set password in user
            // reset token, resetexpiry 
            // save
        } catch (error) {

        }
    } catch (error) {

    }
}

export { registerUser, verifyUser, login, getProfile, logOutUser, forgotPassword, resetPassword }