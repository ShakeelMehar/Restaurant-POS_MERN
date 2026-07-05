import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

import BackButton from "../components/shared/BackButton";
import TableCard from "../components/tables/TableCard";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getTables } from "../https";
import { enqueueSnackbar } from "notistack";
import AddTableModal from "../components/tables/AddTableModal";

const Tables = () => {
  const [status, setStatus] = useState("all");
  const [isAddTableOpen, setIsAddTableOpen] = useState(false);
  const { role } = useSelector((state) => state.user);

  useEffect(() => {
    document.title = "POS | Tables";
  }, []);

  const { data: resData, isError, isLoading } = useQuery({
    queryKey: ["tables"],
    queryFn: async () => {
      return await getTables();
    },
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (isError) {
      enqueueSnackbar("Something went wrong!", { variant: "error" });
    }
  }, [isError]);

  const tableList = resData?.data?.data ?? [];
  const filteredTables = useMemo(() => {
    if (status === "booked") {
      return tableList.filter((table) => table.status === "Booked");
    }

    return tableList;
  }, [status, tableList]);

  const bookedCount = tableList.filter((t) => t.status === "Booked").length;
  const availableCount = tableList.filter((t) => t.status === "Available").length;

  return (
    <section className="min-h-[calc(100vh-5rem)] bg-[#1a1a1a] pb-24">
      {/* Header */}
      <div className="flex flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-10">
        <div className="flex items-center gap-4">
          <BackButton />
          <h1 className="text-[#f5f5f5] text-2xl font-bold tracking-wider">
            Select Table
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Status Legend */}
          {tableList.length > 0 && (
            <div className="flex items-center gap-4 mr-2">
              <div className="flex items-center gap-1.5">
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#F6B100]" />
                <span className="text-xs text-[#ababab]">
                  Available: {availableCount}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#3aaf6f]" />
                <span className="text-xs text-[#ababab]">
                  Booked: {bookedCount}
                </span>
              </div>
            </div>
          )}

          {/* Filter Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setStatus("all")}
              className={`rounded-lg px-4 py-2 text-sm font-semibold text-[#ababab] sm:px-5 sm:text-lg ${
                status === "all" ? "bg-[#383838]" : ""
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatus("booked")}
              className={`rounded-lg px-4 py-2 text-sm font-semibold text-[#ababab] sm:px-5 sm:text-lg ${
                status === "booked" ? "bg-[#383838]" : ""
              }`}
            >
              Booked
            </button>
          </div>

          {["Admin", "Super Admin"].includes(role) && (
            <button
              onClick={() => setIsAddTableOpen(true)}
              className="rounded-lg bg-[#F6B100] px-4 py-2 text-sm font-semibold text-[#1f1f1f] sm:text-base"
            >
              Add Table
            </button>
          )}
        </div>
      </div>

      {/* Table Grid */}
      <div className="grid grid-cols-2 gap-3 px-4 py-4 sm:grid-cols-3 sm:px-6 md:grid-cols-4 lg:px-10 xl:grid-cols-5 2xl:grid-cols-6">
        {isLoading && (
          <p className="col-span-full text-center text-sm text-[#ababab]">
            Loading tables...
          </p>
        )}

        {!isLoading && tableList.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#3b3b3b] bg-[#262626] px-6 py-12 text-center">
            <h2 className="text-xl font-semibold text-[#f5f5f5]">
              No tables available
            </h2>
            <p className="mt-2 max-w-md text-sm text-[#ababab]">
              Add your first table to continue the order flow and assign guests
              to a seat.
            </p>
            {["Admin", "Super Admin"].includes(role) && (
              <button
                onClick={() => setIsAddTableOpen(true)}
                className="mt-6 rounded-lg bg-[#F6B100] px-5 py-3 font-semibold text-[#1f1f1f]"
              >
                Add First Table
              </button>
            )}
          </div>
        )}

        {!isLoading && tableList.length > 0 && filteredTables.length === 0 && (
          <p className="col-span-full text-center text-sm text-[#ababab]">
            No booked tables right now.
          </p>
        )}

        {filteredTables.map((table) => {
          return (
            <TableCard
              key={table._id}
              id={table._id}
              name={table.tableNo}
              status={table.status}
              initials={table?.currentOrder?.customerDetails.name}
              seats={table.seats}
            />
          );
        })}
      </div>

      <AddTableModal
        isOpen={isAddTableOpen}
        onClose={() => setIsAddTableOpen(false)}
      />


    </section>
  );
};

export default Tables;
