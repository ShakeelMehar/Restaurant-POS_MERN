import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { enqueueSnackbar } from "notistack";
import Modal from "../shared/Modal";
import {
  addDish,
  selectMenuCategories,
} from "../../redux/slices/menuSlice";

const initialDishData = {
  categoryId: "",
  name: "",
  price: "",
  category: "",
};

const AddDishModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const categories = useSelector(selectMenuCategories);
  const [dishData, setDishData] = useState(initialDishData);

  useEffect(() => {
    if (categories.length > 0) {
      setDishData((prev) => ({
        ...prev,
        categoryId: prev.categoryId || categories[0].id,
      }));
    }
  }, [categories]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDishData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const name = dishData.name.trim();

    if (!name) {
      enqueueSnackbar("Dish name is required.", { variant: "warning" });
      return;
    }

    dispatch(
      addDish({
        ...dishData,
        name,
        category: dishData.category.trim(),
        price: Number(dishData.price),
      })
    );
    enqueueSnackbar("Dish added.", { variant: "success" });
    setDishData({
      ...initialDishData,
      categoryId: categories[0]?.id || "",
    });
    onClose();
  };

  const handleClose = () => {
    setDishData({
      ...initialDishData,
      categoryId: categories[0]?.id || "",
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add Dish">
      {categories.length === 0 ? (
        <div className="space-y-4">
          <p className="text-sm text-[#ababab]">
            Add a category first. Dishes need a target category before they can
            be created.
          </p>
          <button
            onClick={handleClose}
            className="w-full rounded-lg bg-yellow-400 py-3 text-lg font-bold text-gray-900"
          >
            Close
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-[#ababab]">
              Category
            </label>
            <div className="rounded-lg bg-[#1f1f1f] p-4">
              <select
                name="categoryId"
                value={dishData.categoryId}
                onChange={handleInputChange}
                className="w-full bg-transparent text-white focus:outline-none"
                required
              >
                {categories.map((category) => (
                  <option
                    key={category.id}
                    value={category.id}
                    className="bg-[#1f1f1f]"
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#ababab]">
              Dish Name
            </label>
            <div className="rounded-lg bg-[#1f1f1f] p-4">
              <input
                type="text"
                name="name"
                value={dishData.name}
                onChange={handleInputChange}
                placeholder="Chicken Handi"
                className="w-full bg-transparent text-white focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#ababab]">
              Price
            </label>
            <div className="rounded-lg bg-[#1f1f1f] p-4">
              <input
                type="number"
                name="price"
                min="1"
                value={dishData.price}
                onChange={handleInputChange}
                placeholder="450"
                className="w-full bg-transparent text-white focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#ababab]">
              Item Type
            </label>
            <div className="rounded-lg bg-[#1f1f1f] p-4">
              <input
                type="text"
                name="category"
                value={dishData.category}
                onChange={handleInputChange}
                placeholder="Vegetarian"
                className="w-full bg-transparent text-white focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-6 w-full rounded-lg bg-yellow-400 py-3 text-lg font-bold text-gray-900"
          >
            Add Dish
          </button>
        </form>
      )}
    </Modal>
  );
};

export default AddDishModal;
