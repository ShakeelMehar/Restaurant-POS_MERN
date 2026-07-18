const createHttpError = require("http-errors");
const User = require("../models/userModel");
const tenantContext = require("../middlewares/tenantContext");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const Restaurant = require("../models/restaurantModel");
const { ROLES } = require("../constants/roles");

// Strip sensitive fields (password) before returning a user in any response.
const sanitizeUser = (userDoc) => {
    if (!userDoc) return userDoc;
    const { password, ...safe } = userDoc.toObject ? userDoc.toObject() : userDoc;
    return safe;
};

// Admin-only: create a Cashier inside the admin's own restaurant.
// The role and restaurantId are assigned SERVER-SIDE — any role in the request body is ignored,
// which closes both privilege escalation and cross-tenant account creation.
const createCashier = async (req, res, next) => {
    try {

        const { name, phone, email, password } = req.body;

        if(!name || !phone || !email || !password){
            const error = createHttpError(400, "All fields are required!");
            return next(error);
        }

        // Check for duplicate email globally (across all tenants)
        let isUserPresent;
        await tenantContext.run({ bypassIsolation: true }, async () => {
            isUserPresent = await User.findOne({ email });
        });
        if (isUserPresent) {
            const error = createHttpError(400, "User already exist!");
            return next(error);
        }

        // tenantContext is already scoped to the admin's restaurant by isVerifiedUser, so the
        // tenantIsolation plugin also stamps restaurantId on save. We set it explicitly for clarity.
        const newUser = new User({
            name,
            phone,
            email,
            password,
            role: ROLES.CASHIER,               // hard-coded — never trusted from req.body
            restaurantId: req.user.restaurantId, // bound to the acting admin's tenant
            forcePasswordChange: true,
        });
        await newUser.save();

        res.status(201).json({ success: true, message: "New cashier created!", data: sanitizeUser(newUser) });

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

        await tenantContext.run({ bypassIsolation: true }, async () => {
            // Find active users only (or if soft deleted, they can't login)
            isUserPresent = await User.findOne({email, isDeleted: { $ne: true }});
        });
        if (isUserPresent) {
            isMatch = await bcrypt.compare(password, isUserPresent.password);
        }

        if(!isUserPresent || !isMatch){
            const error = createHttpError(401, "Invalid Credentials");
            return next(error);
        }

        // Block login for tenant users whose restaurant has been deactivated by a Super Admin.
        // (Super Admin has no restaurantId, so this check is skipped for them.)
        if (isUserPresent.restaurantId) {
            const restaurant = await Restaurant.findById(isUserPresent.restaurantId).select("isActive");
            if (restaurant && restaurant.isActive === false) {
                const error = createHttpError(403, "This restaurant has been deactivated. Contact the administrator.");
                return next(error);
            }
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
            data: sanitizeUser(isUserPresent),
            accessToken
        });


    } catch (error) {
        next(error);
    }

}

const getUserData = async (req, res, next) => {
    try {
        
        let user = await User.findById(req.user._id).select("-password");
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

        const staff = await User.find({ role: ROLES.CASHIER, isDeleted: { $ne: true } }).select("-password");
        res.status(200).json({ success: true, data: staff });
    } catch (error) {
        next(error);
    }
};

const deleteStaff = async (req, res, next) => {
    try {
        const staffId = req.params.id;



        const user = await User.findById(staffId);
        if (!user) return next(createHttpError(404, "User not found"));
        
        user.isDeleted = true;
        // Optionally scramble the email to free it up for real:
        user.email = `${user.email}.deleted.${Date.now()}`;
        await user.save();
        
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

const updateStaff = async (req, res, next) => {
    try {
        const staffId = req.params.id;
        const { name, email, phone } = req.body;

        if (!name || !email || !phone) {
            return next(createHttpError(400, "Name, email, and phone are required"));
        }

        // Check if email is already taken by another user (bypass tenant isolation for unique check)
        let isEmailTaken;
        await tenantContext.run({ bypassIsolation: true }, async () => {
            isEmailTaken = await User.findOne({ email, _id: { $ne: staffId }, isDeleted: { $ne: true } });
        });
        if (isEmailTaken) {
            return next(createHttpError(400, "Email is already in use by another user"));
        }

        const user = await User.findById(staffId);
        if (!user) return next(createHttpError(404, "Staff member not found"));

        // Role is intentionally NOT updated here — it is immutable through staff editing,
        // so an admin cannot elevate a cashier's privileges.
        user.name = name;
        user.email = email;
        user.phone = phone;

        await user.save();

        res.status(200).json({ success: true, message: "Staff member updated successfully", data: sanitizeUser(user) });
    } catch (error) {
        next(error);
    }
};

module.exports = { createCashier, login, getUserData, logout, getAllStaff, deleteStaff, updateStaffPassword, updateStaff }