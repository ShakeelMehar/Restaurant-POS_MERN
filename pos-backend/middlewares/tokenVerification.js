const createHttpError = require("http-errors");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const User = require("../models/userModel");
const tenantContext = require("./tenantContext");


const isVerifiedUser = async (req, res, next) => {
    try{

        const accessToken = req.cookies?.accessToken || (req.headers.authorization && req.headers.authorization.startsWith("Bearer ") ? req.headers.authorization.split(" ")[1] : null);
        
        if(!accessToken){
            const error = createHttpError(401, "Please provide token!");
            return next(error);
        }

        const decodeToken = jwt.verify(accessToken, config.accessTokenSecret);

        // Fetch user bypassing tenant isolation since we don't have the context yet
        let user;
        await tenantContext.run({ bypassIsolation: true }, async () => {
            user = await User.findById(decodeToken._id);
        });

        if(!user){
            const error = createHttpError(401, "User not exist!");
            return next(error);
        }

        if (user.isDeleted) {
            const error = createHttpError(403, "Account has been deactivated.");
            return next(error);
        }

        req.user = user;

        // Wrap the rest of the request in the tenant context
        tenantContext.run({ restaurantId: user.restaurantId, bypassIsolation: user.role === 'Super Admin' }, () => {
            next();
        });

    }catch (error) {
        const err = createHttpError(401, "Invalid Token!");
        next(err);
    }
}

module.exports = { isVerifiedUser };