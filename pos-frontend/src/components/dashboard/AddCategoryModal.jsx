import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { enqueueSnackbar } from "notistack";
import { useMutation } from "@tanstack/react-query";
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

    const mutation = useMutation({
      mutationFn: async (data) => {
        const { addCategory: apiAddCategory } = await import("../../https/index");
        return apiAddCategory(data);
      },
      onSuccess: (res) => {
        const backendCategory = res.data.data;
        // Map backend to frontend schema for Redux
        const mappedCat = {
            id: backendCategory._id,
            name: backendCategory.name,
            bgColor: backendCategory.bgColor,
            icon: backendCategory.icon,
            items: []
        };
        dispatch(addCategory(mappedCat));
        enqueueSnackbar("Category added.", { variant: "success" });
        setCategoryData(initialCategoryData);
        onClose();
      },
      onError: (err) => {
        enqueueSnackbar(err?.response?.data?.message || "Failed to add category", { variant: "error" });
      }
    });

  const handleSubmit = (e) => {
    e.preventDefault();
    const name = categoryData.name.trim();

    if (!name) {
      enqueueSnackbar("Category name is required.", { variant: "warning" });
      return;
    }

    mutation.mutate({ ...categoryData, name });
  };

  const handleClose = () => {
    setCategoryData(initialCategoryData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add Category">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">
            Category Name <span className="text-error">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={categoryData.name}
            onChange={handleInputChange}
            placeholder="Starters"
            className="w-full bg-[hsl(var(--surface-strong))] border border-transparent focus:border-primary/50 focus:bg-background rounded-[8px] px-4 py-3 text-sm text-foreground transition-all outline-none"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">
            Icon
          </label>
          <input
            type="text"
            name="icon"
            value={categoryData.icon}
            onChange={handleInputChange}
            placeholder="+"
            className="w-full bg-[hsl(var(--surface-strong))] border border-transparent focus:border-primary/50 focus:bg-background rounded-[8px] px-4 py-3 text-sm text-foreground transition-all outline-none"
            maxLength={4}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">
            Card Color
          </label>
          <div className="flex items-center gap-4 bg-[hsl(var(--surface-strong))] border border-transparent rounded-[8px] px-4 py-3">
            <input
              type="color"
              name="bgColor"
              value={categoryData.bgColor}
              onChange={handleInputChange}
              className="h-8 w-14 cursor-pointer rounded border-none bg-transparent"
            />
            <span className="text-sm font-medium text-foreground">{categoryData.bgColor}</span>
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 w-full rounded-[8px] bg-primary py-3 text-[16px] font-medium text-white"
        >
          Add Category
        </button>
      </form>
    </Modal>
  );
};

export default AddCategoryModal;
