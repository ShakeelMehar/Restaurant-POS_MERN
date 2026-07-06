import React from "react";
import { useNavigate } from "react-router-dom";
import { getAvatarName } from "../../utils";
import { useDispatch } from "react-redux";
import { updateTable } from "../../redux/slices/customerSlice";
import TableVisual from "./TableVisual";

const TableCard = ({ id, name, status, initials, seats }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClick = () => {
    if (status === "Booked") return;

    const table = { tableId: id, tableNo: name };
    dispatch(updateTable({ table }));
    navigate(`/menu`);
  };

  const label = getAvatarName(initials) || `T${name}`;

  return (
    <div
      onClick={handleClick}
      className={`group relative flex flex-col items-center rounded-2xl bg-card p-4 transition-all duration-300 ${
        status === "Booked"
          ? "cursor-default"
          : "cursor-pointer hover:bg-secondary/80 hover:shadow-lg hover:shadow-yellow-900/20"
      }`}
    >
      {/* Status badge */}
      <div className="mb-1 flex w-full items-center justify-between px-1">
        <span className="text-sm font-semibold text-foreground tracking-wide">
          Table {name}
        </span>
        <span
          className={`rounded-full px-3 py-0.5 text-xs font-bold tracking-wider uppercase ${
            status === "Booked"
              ? "bg-success/20 text-success"
              : "bg-primary-blue/20 text-primary-blue"
          }`}
        >
          {status}
        </span>
      </div>

      {/* Visual table */}
      <TableVisual
        seats={seats}
        status={status}
        label={label}
        tableNo={name}
      />

      {/* Seats info */}
      <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
        <span>
          {seats} {seats === 1 ? "Seat" : "Seats"}
        </span>
      </div>
    </div>
  );
};

export default TableCard;
