import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    orderId: "",
    customerName: "",
    customerPhone: "",
    guests: 0,
    table: null,
    editingOrderId: "",
    orderStatus: "",
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
            state.paymentMethod = "";
            state.orderDate = new Date().toISOString();
        },

        removeCustomer: (state) => {
            state.orderId = "";
            state.customerName = "";
            state.customerPhone = "";
            state.guests = 0;
            state.table = null;
            state.editingOrderId = "";
            state.orderStatus = "";
            state.paymentMethod = "";
            state.orderDate = "";
        },

        updateTable: (state, action) => {
            state.table = action.payload.table;
        },

        setEditingOrder: (state, action) => {
            const { order } = action.payload;
            state.orderId = `${Math.floor(
                new Date(order.orderDate || order.createdAt).getTime()
            )}`;
            state.customerName = order.customerDetails?.name || "";
            state.customerPhone = order.customerDetails?.phone || "";
            state.guests = order.customerDetails?.guests || 0;
            state.table = order.table
                ? {
                    tableId: order.table._id,
                    tableNo: order.table.tableNo,
                  }
                : null;
            state.editingOrderId = order._id;
            state.orderStatus = order.orderStatus || "In Progress";
            state.paymentMethod = order.paymentMethod || "";
            state.orderDate = order.orderDate || order.createdAt || "";
        }

    }
})


export const { setCustomer, removeCustomer, updateTable, setEditingOrder } = customerSlice.actions;
export default customerSlice.reducer;
