import { FiArrowRight } from "react-icons/fi";
import { getAvatarName } from "../../utils/index";

const statusBadge = (status) => {
  if (status === "Ready")
    return "bg-success/10 text-success border border-success/25";
  if (status === "Completed")
    return "bg-muted text-muted-foreground border border-border";
  return "bg-blue-500/10 text-blue-600 border border-blue-500/25";
};

const OrderList = ({ order, onManage }) => {
  return (
    <button
      type="button"
      onClick={() => onManage(order)}
      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left transition-all duration-200 hover:bg-secondary/70 border border-transparent hover:border-border group"
    >
      {/* Avatar */}
      <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/20 text-foreground text-sm font-extrabold">
        {getAvatarName(order.customerDetails?.name)}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-foreground truncate">
          {order.customerDetails?.name || "Customer"}
        </p>
        <p className="text-xs text-muted-foreground font-medium mt-0.5">
          {(order.items || []).length} items
        </p>
      </div>

      {/* Table */}
      <div className="flex items-center gap-1 text-xs font-bold text-muted-foreground bg-secondary rounded-lg px-2.5 py-1.5 border border-border flex-shrink-0">
        T<FiArrowRight size={10} className="inline" />{order.table?.tableNo ?? "N/A"}
      </div>

      {/* Status */}
      <span className={`flex-shrink-0 text-xs font-bold px-2.5 py-1 rounded-full ${statusBadge(order.orderStatus)}`}>
        {order.orderStatus}
      </span>
    </button>
  );
};

export default OrderList;
