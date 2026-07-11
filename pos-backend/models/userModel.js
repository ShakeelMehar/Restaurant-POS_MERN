const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const tenantIsolation = require("./plugins/tenantIsolation");

const userSchema = new mongoose.Schema({
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant",
        index: true
    },
    name : {
        type: String,
        required: true,
    },

    email : {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (v) {
                return /\S+@\S+\.\S+/.test(v);
            },
            message : "Email must be in valid format!"
        }
    },

    phone: {
        type : String,
        required: true,
        validate: {
            validator: function (v) {
                return /^\d{4}-\d{7}$/.test(v) || /^\d{10,11}$/.test(v);
            },
            message : "Phone number must be valid!"
        }
    },

    password: {
        type: String,
        required: true,
    },

    role: {
        type: String,
        required: true
    },
    isDeleted: {
        type: Boolean,
        default: false,
        index: true
    }
}, { timestamps : true })

userSchema.pre('save', async function (next) {
    if(!this.isModified('password')){
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

userSchema.plugin(tenantIsolation);

module.exports = mongoose.model("User", userSchema);