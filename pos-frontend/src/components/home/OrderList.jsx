import { FaCheckDouble, FaLongArrowAltRight } from "react-icons/fa";
import { FaCircle } from "react-icons/fa";
import { getAvatarName } from "../../utils/index";

const OrderList = ({ order, onManage }) => {
  return (
    <button
      type="button"
      onClick={() => onManage(order)}
      className="mb-3 flex w-full items-center gap-5 rounded-xl px-2 py-3 text-left transition hover:bg-popover"
    >
      <div className="rounded-lg bg-primary text-primary-foreground p-3 text-xl font-bold">
        {getAvatarName(order.customerDetails?.name)}
      </div>
      <div className="flex items-center justify-between w-[100%]">
        <div className="flex flex-col items-start gap-1">
          <h1 className="text-foreground text-lg font-semibold tracking-wide">
            {order.customerDetails?.name || "Customer"}
          </h1>
          <p className="text-muted-foreground text-sm">
            {(order.items || []).length} Items
          </p>
        </div>

        <h1 className="text-primary font-semibold border border-primary rounded-lg p-1">
          Table <FaLongArrowAltRight className="text-muted-foreground ml-2 inline" />{" "}
          {order.table?.tableNo || "N/A"}
        </h1>

        <div className="flex flex-col items-end gap-2">
          {order.orderStatus === "Ready" ? (
            <>
              <p className="text-green-600 bg-success/20 px-2 py-1 rounded-lg">
                <FaCheckDouble className="inline mr-2" /> {order.orderStatus}
              </p>
            </>
          ) : (
            <>
              <p className="text-yellow-600 bg-yellow-500/20 px-2 py-1 rounded-lg">
                <FaCircle className="inline mr-2" /> {order.orderStatus}
              </p>
            </>
          )}
        </div>
      </div>
    </button>
  );
};

export default OrderList;
