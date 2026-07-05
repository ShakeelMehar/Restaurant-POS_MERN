import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { addTable } from "../../https";
import Modal from "../shared/Modal";

const initialTableData = {
  tableNo: "",
  seats: "",
};

const AddTableModal = ({ isOpen, onClose }) => {
  const [tableData, setTableData] = useState(initialTableData);
  const queryClient = useQueryClient();

  const tableMutation = useMutation({
    mutationFn: (reqData) => addTable(reqData),
    onSuccess: ({ data }) => {
      enqueueSnackbar(data.message, { variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["tables"] });
      setTableData(initialTableData);
      onClose();
    },
    onError: (error) => {
      const message = error?.response?.data?.message || "Unable to add table.";
      enqueueSnackbar(message, { variant: "error" });
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTableData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    tableMutation.mutate({
      tableNo: Number(tableData.tableNo),
      seats: Number(tableData.seats),
    });
  };

  const handleClose = () => {
    if (tableMutation.isPending) return;
    setTableData(initialTableData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add Table">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-2 mt-3 block text-sm font-medium text-[#ababab]">
            Table Number
          </label>
          <div className="flex items-center rounded-lg bg-[#1f1f1f] p-4">
            <input
              type="number"
              name="tableNo"
              min="1"
              value={tableData.tableNo}
              onChange={handleInputChange}
              className="flex-1 bg-transparent text-white focus:outline-none"
              required
            />
          </div>
        </div>

        <div>
          <label className="mb-2 mt-3 block text-sm font-medium text-[#ababab]">
            Number of Seats
          </label>
          <div className="flex items-center rounded-lg bg-[#1f1f1f] p-4">
            <input
              type="number"
              name="seats"
              min="1"
              max="8"
              value={tableData.seats}
              onChange={handleInputChange}
              className="flex-1 bg-transparent text-white focus:outline-none"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={tableMutation.isPending}
          className="mt-6 w-full rounded-lg bg-yellow-400 py-3 text-lg font-bold text-gray-900 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {tableMutation.isPending ? "Adding Table..." : "Add Table"}
        </button>
      </form>
    </Modal>
  );
};

export default AddTableModal;
