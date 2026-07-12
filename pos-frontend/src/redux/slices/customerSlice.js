import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    orderId: "",
    customerName: "",
    customerPhone: "",
    guests: 0,
    editingOrderId: "",
    orderStatus: "",
    orderType: "Dine In",
    paymentMethod: "",
    orderDate: ""
}


const customerSlice = createSlice({
    name : "customer",
    initialState,
    reducers : {
        setCustomer: (state, action) => {
            const { name, phone, guests } = action.payload;
            state.orderId = `${Date.now()}`;
            state.customerName = name;
            state.customerPhone = phone;
            state.guests = guests;
            state.editingOrderId = "";
            state.orderStatus = "";
            state.orderType = "Dine In";
            state.paymentMethod = "";
            state.orderDate = new Date().toISOString();
        },

        removeCustomer: (state) => {
            state.orderId = "";
            state.customerName = "";
            state.customerPhone = "";
            state.guests = 0;
            state.editingOrderId = "";
            state.orderStatus = "";
            state.orderType = "Dine In";
            state.paymentMethod = "";
            state.orderDate = "";
        },



        setOrderType: (state, action) => {
            state.orderType = action.payload;
        },

        setEditingOrder: (state, action) => {
            const { order } = action.payload;
            state.orderId = `${Math.floor(
                new Date(order.orderDate || order.createdAt).getTime()
            )}`;
            state.customerName = order.customerDetails?.name || "";
            state.customerPhone = order.customerDetails?.phone || "";
            state.guests = order.customerDetails?.guests || 0;
            state.editingOrderId = order._id;
            state.orderStatus = order.orderStatus || "In Progress";
            state.orderType = order.orderType || "Dine In";
            state.paymentMethod = order.paymentMethod || "";
            state.orderDate = order.orderDate || order.createdAt || "";
        }

    }
})


export const { setCustomer, removeCustomer, setOrderType, setEditingOrder } = customerSlice.actions;
export default customerSlice.reducer;
