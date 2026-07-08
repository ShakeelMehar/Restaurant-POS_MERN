import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import BackButton from "../components/shared/BackButton";
import TableCard from "../components/tables/TableCard";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getTables } from "../https";
import { enqueueSnackbar } from "notistack";
import AddTableModal from "../components/tables/AddTableModal";
import { FiPlus } from "react-icons/fi";

const Tables = () => {
  const [status, setStatus] = useState("all");
  const [isAddTableOpen, setIsAddTableOpen] = useState(false);
  const { role } = useSelector((state) => state.user);

  useEffect(() => { document.title = "POS | Tables"; }, []);

  const { data: resData, isError, isLoading } = useQuery({
    queryKey: ["tables"],
    queryFn: async () => await getTables(),
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (isError) enqueueSnackbar("Something went wrong!", { variant: "error" });
  }, [isError]);

  const tableList = resData?.data?.data ?? [];
  const filteredTables = useMemo(() => {
    if (status === "booked") return tableList.filter((t) => t.status === "Booked");
    return tableList;
  }, [status, tableList]);

  const bookedCount = tableList.filter((t) => t.status === "Booked").length;
  const availableCount = tableList.filter((t) => t.status === "Available").length;

  return (
    <section className="min-h-[calc(100dvh-4rem)] bg-background pb-24">
      {/* Header */}
      <div className="flex flex-col gap-2 px-4 py-2 border-b border-border bg-card/50 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <BackButton />
          <div>
            <h1 className="text-lg font-extrabold text-foreground tracking-tight">Tables</h1>
            <p className="text-xs text-muted-foreground font-medium">
              {availableCount} available · {bookedCount} booked
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Filter tabs */}
          {[
            { id: "all",    label: "All" },
            { id: "booked", label: "Booked" },
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setStatus(id)}
              className={`px-3 py-2 rounded-full text-sm font-bold transition-all duration-200 ${
                status === id
                  ? "bg-gradient-to-r from-primary to-blue-500 text-primary-foreground shadow-md shadow-primary/30"
                  : "bg-secondary border border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
              }`}
            >
              {label}
            </button>
          ))}

          {/* Legend dots */}
          <div className="hidden sm:flex items-center gap-2 mx-2">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-primary inline-block" />
              <span className="text-xs text-muted-foreground font-medium">Available</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-success inline-block" />
              <span className="text-xs text-muted-foreground font-medium">Booked</span>
            </div>
          </div>

          {["Admin", "Super Admin"].includes(role) && (
            <button
              onClick={() => setIsAddTableOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-blue-500 px-3 py-2 text-sm font-bold text-primary-foreground shadow-md shadow-primary/30 hover:shadow-lg transition-all active:scale-95"
            >
              <FiPlus size={15} /> Add Table
            </button>
          )}
        </div>
      </div>

      {/* Table Grid */}
      <div className="grid grid-cols-2 gap-2 px-4 py-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {isLoading && (
          <>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="h-32 bg-card rounded-[14px] border border-border animate-pulse" />
            ))}
          </>
        )}

        {!isLoading && tableList.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center rounded-[14px] border border-dashed border-border bg-card px-4 py-16 text-center gap-2">
            <span className="text-5xl">🪑</span>
            <div>
              <h2 className="text-base font-bold text-foreground">No tables yet</h2>
              <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                Add your first table to start assigning guests and managing orders.
              </p>
            </div>
            {["Admin", "Super Admin"].includes(role) && (
              <button
                onClick={() => setIsAddTableOpen(true)}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-blue-500 px-4 py-2 font-bold text-primary-foreground shadow-md shadow-primary/30 transition-all"
              >
                <FiPlus size={16} /> Add First Table
              </button>
            )}
          </div>
        )}

        {!isLoading && tableList.length > 0 && filteredTables.length === 0 && (
          <p className="col-span-full text-center text-sm text-muted-foreground py-10">
            No booked tables right now.
          </p>
        )}

        {filteredTables.map((table) => (
          <TableCard
            key={table._id}
            id={table._id}
            name={table.tableNo}
            status={table.status}
            initials={table?.currentOrder?.customerDetails?.name}
            seats={table.seats}
          />
        ))}
      </div>

      <AddTableModal isOpen={isAddTableOpen} onClose={() => setIsAddTableOpen(false)} />
    </section>
  );
};

export default Tables;
