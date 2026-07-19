import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    _id: "",
    name: "",
    email : "",
    phone: "",
    role: "",
    restaurantId: "",
    forcePasswordChange: false,
    isAuth: false
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action) => {
            const { _id, name, phone, email, role, restaurantId, forcePasswordChange } = action.payload;
            state._id = _id;
            state.name = name;
            state.phone = phone;
            state.email = email;
            state.role = role;
            state.restaurantId = restaurantId || "";
            state.forcePasswordChange = Boolean(forcePasswordChange);
            state.isAuth = true;
        },

        // Called after a successful self-service password change to lift the forced-reset gate.
        clearForcePasswordChange: (state) => {
            state.forcePasswordChange = false;
        },

        removeUser: (state) => {
            state._id = "";
            state.email = "";
            state.name = "";
            state.phone = "";
            state.role = "";
            state.restaurantId = "";
            state.forcePasswordChange = false;
            state.isAuth = false;
        }
    }
})

export const { setUser, clearForcePasswordChange, removeUser } = userSlice.actions;
export default userSlice.reducer;