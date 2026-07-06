import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import OrderList from "./OrderList";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { getOrders } from "../../https/index";
import OrderDetailsModal from "../orders/OrderDetailsModal";

const RecentOrders = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedOrder, setSelectedOrder] = useState(null);
    const { data: resData, isError } = useQuery({
        queryKey: ["orders"],
        queryFn: async () => {
            return await getOrders();
        },
        placeholderData: keepPreviousData,
    });

    useEffect(() => {
        if (isError) {
            enqueueSnackbar("Something went wrong!", { variant: "error" });
        }
    }, [isError]);

    const orders = resData?.data?.data || [];
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const filteredOrders = orders.filter((order) => {
        if (!normalizedQuery) {
            return true;
        }

        const customerName = order.customerDetails?.name?.toLowerCase() || "";
        const orderStatus = order.orderStatus?.toLowerCase() || "";
        const tableNo = String(order.table?.tableNo || "").toLowerCase();
        const itemNames = (order.items || [])
            .map((item) => item.name?.toLowerCase() || "")
            .join(" ");

        return (
            customerName.includes(normalizedQuery) ||
            orderStatus.includes(normalizedQuery) ||
            tableNo.includes(normalizedQuery) ||
            itemNames.includes(normalizedQuery)
        );
    });

    return (
        <div className="px-8 mt-6">
            <div className="bg-card w-full h-[450px] rounded-lg">
                <div className="flex justify-between items-center px-6 py-4">
                    <h1 className="text-foreground text-lg font-semibold tracking-wide">
                        Recent Orders
                    </h1>
                    <a href="/orders" className="text-blue-600 text-sm font-semibold">
                        View all
                    </a>
                </div>

                <div className="flex items-center gap-4 bg-background rounded-[15px] px-6 py-4 mx-6">
                    <FaSearch className="text-foreground" />
                    <input
                        type="text"
                        placeholder="Search recent orders"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-background outline-none text-foreground"
                    />
                </div>

                {/* Order list */}
                <div className="mt-4 px-6 overflow-y-scroll h-[300px] scrollbar-hide">
                    {filteredOrders.length > 0 ? (
                        filteredOrders.map((order) => {
                            return (
                                <OrderList
                                    key={order._id}
                                    order={order}
                                    onManage={setSelectedOrder}
                                />
                            );
                        })
                    ) : (
                        <p className="col-span-3 text-gray-500">No orders available</p>
                    )}
                </div>
            </div>

            <OrderDetailsModal
                order={selectedOrder}
                isOpen={Boolean(selectedOrder)}
                onClose={() => setSelectedOrder(null)}
            />
        </div>
    );
};

export default RecentOrders;
