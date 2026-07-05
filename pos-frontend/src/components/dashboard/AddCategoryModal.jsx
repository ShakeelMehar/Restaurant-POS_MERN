import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { enqueueSnackbar } from "notistack";
import Modal from "../shared/Modal";
import { addCategory } from "../../redux/slices/menuSlice";

const initialCategoryData = {
  name: "",
  icon: "+",
  bgColor: "#5b45b0",
};

const AddCategoryModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [categoryData, setCategoryData] = useState(initialCategoryData);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCategoryData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const name = categoryData.name.trim();

    if (!name) {
      enqueueSnackbar("Category name is required.", { variant: "warning" });
      return;
    }

    dispatch(addCategory({ ...categoryData, name }));
    enqueueSnackbar("Category added.", { variant: "success" });
    setCategoryData(initialCategoryData);
    onClose();
  };

  const handleClose = () => {
    setCategoryData(initialCategoryData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add Category">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-[#ababab]">
            Category Name
          </label>
          <div className="rounded-lg bg-[#1f1f1f] p-4">
            <input
              type="text"
              name="name"
              value={categoryData.name}
              onChange={handleInputChange}
              placeholder="Starters"
              className="w-full bg-transparent text-white focus:outline-none"
              required
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#ababab]">
            Icon
          </label>
          <div className="rounded-lg bg-[#1f1f1f] p-4">
            <input
              type="text"
              name="icon"
              value={categoryData.icon}
              onChange={handleInputChange}
              placeholder="+"
              className="w-full bg-transparent text-white focus:outline-none"
              maxLength={4}
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#ababab]">
            Card Color
          </label>
          <div className="flex items-center gap-4 rounded-lg bg-[#1f1f1f] p-4">
            <input
              type="color"
              name="bgColor"
              value={categoryData.bgColor}
              onChange={handleInputChange}
              className="h-10 w-14 cursor-pointer rounded border-none bg-transparent"
            />
            <span className="text-sm text-[#ababab]">{categoryData.bgColor}</span>
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 w-full rounded-lg bg-yellow-400 py-3 text-lg font-bold text-gray-900"
        >
          Add Category
        </button>
      </form>
    </Modal>
  );
};

export default AddCategoryModal;
