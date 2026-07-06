const createHttpError = require("http-errors");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config/config");

const register = async (req, res, next) => {
    try {

        const { name, phone, email, password, role } = req.body;

        if(!name || !phone || !email || !password || !role){
            const error = createHttpError(400, "All fields are required!");
            return next(error);
        }



        const isUserPresent = await User.findOne({email});
        if(isUserPresent){
            const error = createHttpError(400, "User already exist!");
            return next(error);
        }


        const user = { name, phone, email, password, role };
        const newUser = User(user);
        await newUser.save();

        res.status(201).json({success: true, message: "New user created!", data: newUser});


    } catch (error) {
        next(error);
    }
}


const login = async (req, res, next) => {

    try {
        
        const { email, password } = req.body;

        if(!email || !password) {
            const error = createHttpError(400, "All fields are required!");
            return next(error);
        }

        let isUserPresent;
        let isMatch = false;

        isUserPresent = await User.findOne({email});
        if (isUserPresent) {
            isMatch = await bcrypt.compare(password, isUserPresent.password);
        }

        if(!isUserPresent || !isMatch){
            const error = createHttpError(401, "Invalid Credentials");
            return next(error);
        }

        const accessToken = jwt.sign({_id: isUserPresent._id}, config.accessTokenSecret, {
            expiresIn : '1d'
        });

        res.cookie('accessToken', accessToken, {
            maxAge: 1000 * 60 * 60 *24 * 30,
            httpOnly: true,
            sameSite: 'none',
            secure: true
        })

        res.status(200).json({success: true, message: "User login successfully!", 
            data: isUserPresent
        });


    } catch (error) {
        next(error);
    }

}

const getUserData = async (req, res, next) => {
    try {
        
        let user = await User.findById(req.user._id);
        res.status(200).json({success: true, data: user});

    } catch (error) {
        next(error);
    }
}

const logout = async (req, res, next) => {
    try {
        
        res.clearCookie('accessToken');
        res.status(200).json({success: true, message: "User logout successfully!"});

    } catch (error) {
        next(error);
    }
}




const getAllStaff = async (req, res, next) => {
    try {

        const staff = await User.find({ role: { $regex: new RegExp("^cashier$", "i") } }).select("-password");
        res.status(200).json({ success: true, data: staff });
    } catch (error) {
        next(error);
    }
};

const deleteStaff = async (req, res, next) => {
    try {
        const staffId = req.params.id;



        const user = await User.findByIdAndDelete(staffId);
        if (!user) return next(createHttpError(404, "User not found"));
        res.status(200).json({ success: true, message: "Staff removed successfully" });
    } catch (error) {
        next(error);
    }
};

const updateStaffPassword = async (req, res, next) => {
    try {
        const staffId = req.params.id;
        const { password } = req.body;
        if (!password) return next(createHttpError(400, "Password is required"));
        


        const user = await User.findById(staffId);
        if (!user) return next(createHttpError(404, "User not found"));
        
        user.password = password; // Will be hashed by pre-save hook
        await user.save();
        res.status(200).json({ success: true, message: "Password updated successfully" });
    } catch (error) {
        next(error);
    }
};

module.exports = { register, login, getUserData, logout, getAllStaff, deleteStaff, updateStaffPassword }