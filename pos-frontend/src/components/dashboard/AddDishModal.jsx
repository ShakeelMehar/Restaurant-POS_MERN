import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { enqueueSnackbar } from "notistack";
import { useMutation } from "@tanstack/react-query";
import Modal from "../shared/Modal";
import Switch from "../shared/Switch";
import { addProduct, updateProduct } from "../../https/index";
import {
  addDish,
  updateDish,
  selectMenuCategories,
} from "../../redux/slices/menuSlice";

const CustomCheckbox = ({ checked, onChange, label }) => (
  <div className="flex items-center gap-3 cursor-pointer select-none">
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-[6px] border transition-all duration-150 ${
        checked
          ? "bg-[#222222] border-[#222222] text-white"
          : "border-[hsl(var(--border-strong))] bg-background hover:border-foreground"
      }`}
    >
      {checked && (
        <svg className="h-3 w-3 stroke-[3px] stroke-white fill-none" viewBox="0 0 24 24">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )}
    </button>
    <span className="text-sm font-semibold text-foreground" onClick={() => onChange(!checked)}>{label}</span>
  </div>
);

const initialDishData = {
  categoryId: "",
  name: "",
  price: "",
  category: "",
};

const AddDishModal = ({ isOpen, onClose, dishToEdit }) => {
  const dispatch = useDispatch();
  const categories = useSelector(selectMenuCategories);
  const [dishData, setDishData] = useState(initialDishData);
  const [hasPortions, setHasPortions] = useState(false);
  const [activePortions, setActivePortions] = useState({ quarter: false, half: false, large: false });
  const [portionPrices, setPortionPrices] = useState({ quarter: "", half: "", large: "" });

  useEffect(() => {
    if (categories.length > 0) {
      setDishData((prev) => ({
        ...prev,
        categoryId: prev.categoryId || categories[0].id,
      }));
    }
  }, [categories]);

  useEffect(() => {
    if (dishToEdit) {
      setDishData({
        categoryId: dishToEdit.categoryId,
        name: dishToEdit.name,
        price: dishToEdit.price || "",
        category: dishToEdit.category || "",
      });
      setHasPortions(dishToEdit.hasPortions || false);
      if (dishToEdit.portions) {
        setActivePortions({
          quarter: dishToEdit.portions.quarter > 0,
          half: dishToEdit.portions.half > 0,
          large: dishToEdit.portions.large > 0,
        });
        setPortionPrices({
          quarter: dishToEdit.portions.quarter || "",
          half: dishToEdit.portions.half || "",
          large: dishToEdit.portions.large || "",
        });
      }
    } else {
      handleReset();
    }
  }, [dishToEdit, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDishData((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setDishData({
      ...initialDishData,
      categoryId: categories[0]?.id || "",
    });
    setHasPortions(false);
    setActivePortions({ quarter: false, half: false, large: false });
    setPortionPrices({ quarter: "", half: "", large: "" });
  };

  const mutation = useMutation({
    mutationFn: (data) => {
      if (dishToEdit) {
        return updateProduct(dishToEdit.id, data);
      }
      return addProduct(data);
    },
    onSuccess: (res) => {
      const backendProduct = res.data.data;
      const mappedDish = {
          id: backendProduct._id,
          categoryId: dishData.categoryId,
          name: backendProduct.name,
          price: backendProduct.price,
          category: backendProduct.category,
          hasPortions: backendProduct.hasPortions,
          portions: backendProduct.portions,
      };
      if (dishToEdit) {
        dispatch(updateDish(mappedDish));
        enqueueSnackbar("Dish updated.", { variant: "success" });
      } else {
        dispatch(addDish(mappedDish));
        enqueueSnackbar("Dish added.", { variant: "success" });
      }
      handleReset();
      onClose();
    },
    onError: (err) => {
      enqueueSnackbar(err?.response?.data?.message || `Failed to ${dishToEdit ? "update" : "add"} dish`, { variant: "error" });
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const name = dishData.name.trim();

    if (!name) {
      enqueueSnackbar("Dish name is required.", { variant: "warning" });
      return;
    }

    if (hasPortions) {
      const activeKeys = Object.keys(activePortions).filter((k) => activePortions[k]);
      if (activeKeys.length === 0) {
        enqueueSnackbar("Please select at least one portion size.", { variant: "warning" });
        return;
      }
      for (const k of activeKeys) {
        const pVal = Number(portionPrices[k]);
        if (isNaN(pVal) || pVal <= 0) {
          enqueueSnackbar(`Please enter a valid price for the ${k} portion.`, { variant: "warning" });
          return;
        }
      }
    } else {
      if (!dishData.price || Number(dishData.price) <= 0) {
        enqueueSnackbar("Price is required and must be greater than 0.", { variant: "warning" });
        return;
      }
    }

    const basePrice = hasPortions
      ? Number(portionPrices.quarter || portionPrices.half || portionPrices.large || 0)
      : Number(dishData.price);

    const portionsPayload = {
      quarter: hasPortions && activePortions.quarter ? Number(portionPrices.quarter) : 0,
      half: hasPortions && activePortions.half ? Number(portionPrices.half) : 0,
      large: hasPortions && activePortions.large ? Number(portionPrices.large) : 0,
    };

    mutation.mutate({
      name,
      category: dishData.categoryId,
      price: basePrice,
      description: "",
      optionGroups: [],
      hasPortions,
      portions: portionsPayload
    });
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={dishToEdit ? "Edit Dish" : "Add Dish"}>
      {categories.length === 0 ? (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Add a category first. Dishes need a target category before they can
            be created.
          </p>
          <button
            onClick={handleClose}
            className="w-full rounded-lg bg-primary py-2 text-base font-bold text-primary-foreground"
          >
            Close
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Category <span className="text-error">*</span>
            </label>
            <select
              name="categoryId"
              value={dishData.categoryId}
              onChange={handleInputChange}
              className="input-base cursor-pointer"
              required
            >
              {categories.map((category) => (
                <option
                  key={category.id}
                  value={category.id}
                  className="bg-background"
                >
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Dish Name <span className="text-error">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={dishData.name}
              onChange={handleInputChange}
              placeholder="Chicken Handi"
              className="input-base"
              required
            />
          </div>

          {/* Portion/Size Toggle */}
          <div className="flex items-center justify-between py-3 border-t border-b border-border/50">
            <label className="text-sm font-semibold text-foreground cursor-pointer select-none" htmlFor="hasPortions-toggle" onClick={() => setHasPortions(!hasPortions)}>
              Portion or Size (Quatr, Half, Large)
            </label>
            <Switch
              id="hasPortions-toggle"
              checked={hasPortions}
              onChange={setHasPortions}
            />
          </div>

          {!hasPortions ? (
            <div>
              <label className="mb-2 block text-sm font-semibold text-foreground">
                Price <span className="text-error">*</span>
              </label>
              <input
                type="number"
                name="price"
                min="1"
                value={dishData.price}
                onChange={handleInputChange}
                placeholder="450"
                className="input-base"
                required
              />
            </div>
          ) : (
            <div className="space-y-3.5 p-4 bg-secondary/10 border border-border rounded-[14px]">
              <span className="block text-[11px] font-bold text-muted uppercase tracking-wider">Configure Portions</span>
              
              {/* Quarter Portion */}
              <div className="flex items-center justify-between gap-3 h-10">
                <div className="min-w-[140px]">
                  <CustomCheckbox
                    checked={activePortions.quarter}
                    onChange={(val) => setActivePortions(prev => ({ ...prev, quarter: val }))}
                    label="Quarter (Quatr)"
                  />
                </div>
                {activePortions.quarter && (
                  <input
                    type="number"
                    value={portionPrices.quarter}
                    onChange={(e) => setPortionPrices(prev => ({ ...prev, quarter: e.target.value }))}
                    placeholder="Price (e.g. 200)"
                    min="1"
                    className="w-[120px] sm:w-[150px] bg-background border border-border focus:border-primary/50 rounded-[8px] px-3 py-2 text-xs font-semibold text-foreground outline-none transition-all"
                    required
                  />
                )}
              </div>

              {/* Half Portion */}
              <div className="flex items-center justify-between gap-3 h-10">
                <div className="min-w-[140px]">
                  <CustomCheckbox
                    checked={activePortions.half}
                    onChange={(val) => setActivePortions(prev => ({ ...prev, half: val }))}
                    label="Half"
                  />
                </div>
                {activePortions.half && (
                  <input
                    type="number"
                    value={portionPrices.half}
                    onChange={(e) => setPortionPrices(prev => ({ ...prev, half: e.target.value }))}
                    placeholder="Price (e.g. 400)"
                    min="1"
                    className="w-[120px] sm:w-[150px] bg-background border border-border focus:border-primary/50 rounded-[8px] px-3 py-2 text-xs font-semibold text-foreground outline-none transition-all"
                    required
                  />
                )}
              </div>

              {/* Large Portion */}
              <div className="flex items-center justify-between gap-3 h-10">
                <div className="min-w-[140px]">
                  <CustomCheckbox
                    checked={activePortions.large}
                    onChange={(val) => setActivePortions(prev => ({ ...prev, large: val }))}
                    label="Large"
                  />
                </div>
                {activePortions.large && (
                  <input
                    type="number"
                    value={portionPrices.large}
                    onChange={(e) => setPortionPrices(prev => ({ ...prev, large: e.target.value }))}
                    placeholder="Price (e.g. 800)"
                    min="1"
                    className="w-[120px] sm:w-[150px] bg-background border border-border focus:border-primary/50 rounded-[8px] px-3 py-2 text-xs font-semibold text-foreground outline-none transition-all"
                    required
                  />
                )}
              </div>
            </div>
          )}

          <button
            type="submit"
            className="mt-6 w-full btn btn-primary h-auto py-3 text-[16px]"
          >
            {dishToEdit ? "Update Dish" : "Add Dish"}
          </button>
        </form>
      )}
    </Modal>
  );
};

export default AddDishModal;
