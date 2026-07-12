import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { enqueueSnackbar } from "notistack";
import { useMutation } from "@tanstack/react-query";
import Modal from "../shared/Modal";
import { addCategory } from "../../redux/slices/menuSlice";

const PRESET_ICONS = ["🍕", "🍔", "🥤", "🍲", "🍖", "🥗", "🍰", "☕", "🍳", "🍦", "🍛", "🍿"];
const PRESET_COLORS = [
  "#ff385c", // Rausch Red
  "#5b45b0", // Deep Purple
  "#008489", // Teal
  "#3c5a99", // Blue
  "#f5a623", // Warm Orange
  "#7ed321", // Green
  "#4a90e2", // Sky Blue
  "#460479", // Luxe Violet
  "#92174d", // Plus Pink
  "#222222", // Ink Charcoal
];

const initialCategoryData = {
  name: "",
  icon: "🍕",
  bgColor: "#ff385c",
};

const AddCategoryModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [categoryData, setCategoryData] = useState(initialCategoryData);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCategoryData((prev) => ({ ...prev, [name]: value }));
  };

  const selectPresetIcon = (icon) => {
    setCategoryData((prev) => ({ ...prev, icon }));
  };

  const selectPresetColor = (bgColor) => {
    setCategoryData((prev) => ({ ...prev, bgColor }));
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
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-semibold text-foreground">
            Category Name <span className="text-error">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={categoryData.name}
            onChange={handleInputChange}
            placeholder="e.g. Starters, Desserts"
            className="input-base"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-foreground">
            Choose Icon
          </label>
          <div className="grid grid-cols-6 gap-2 mb-3 bg-secondary/20 p-2.5 rounded-[12px] border border-border/30">
            {PRESET_ICONS.map((icon) => {
              const isSelected = categoryData.icon === icon;
              return (
                <button
                  type="button"
                  key={icon}
                  onClick={() => selectPresetIcon(icon)}
                  className={`text-xl h-10 w-10 flex items-center justify-center rounded-[8px] transition-all hover:scale-105 active:scale-95 ${
                    isSelected
                      ? "bg-primary text-white shadow-sm ring-2 ring-primary ring-offset-2 ring-offset-card"
                      : "bg-card hover:bg-surface-strong text-foreground border border-border/40"
                  }`}
                >
                  {icon}
                </button>
              );
            })}
          </div>

        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-foreground">
            Choose Color
          </label>
          <div className="grid grid-cols-5 gap-2 mb-3 bg-secondary/20 p-2.5 rounded-[12px] border border-border/30 justify-items-center">
            {PRESET_COLORS.map((color) => {
              const isSelected = categoryData.bgColor.toLowerCase() === color.toLowerCase();
              return (
                <button
                  type="button"
                  key={color}
                  onClick={() => selectPresetColor(color)}
                  style={{ backgroundColor: color }}
                  className={`h-8 w-8 rounded-full transition-all hover:scale-110 active:scale-95 shadow-sm relative ${
                    isSelected ? "ring-2 ring-primary ring-offset-2 ring-offset-card" : "border border-black/10"
                  }`}
                >
                  {isSelected && (
                    <span className="absolute inset-0 flex items-center justify-center text-white text-[10px] font-bold">✓</span>
                  )}
                </button>
              );
            })}
          </div>

        </div>

        <button
          type="submit"
          className="mt-6 w-full btn btn-primary h-auto py-3 text-[16px]"
        >
          Add Category
        </button>
      </form>
    </Modal>
  );
};

export default AddCategoryModal;
