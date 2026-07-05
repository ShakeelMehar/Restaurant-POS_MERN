import React, { useState, useEffect } from "react";
import { AiOutlineClose } from "react-icons/ai";

// Mock variant data for Phase 1 UI testing
const MOCK_VARIANT_GROUPS = [
  {
    id: "portion",
    name: "Portion",
    options: [
      { id: "half", name: "Half", priceAdjustment: 0 },
      { id: "full", name: "Full", priceAdjustment: 200 },
    ],
  },
  {
    id: "type",
    name: "Type",
    options: [
      { id: "sada", name: "Sada", priceAdjustment: 0 },
      { id: "chicken", name: "Chicken", priceAdjustment: 100 },
      { id: "beef", name: "Beef", priceAdjustment: 150 },
    ],
  },
];

const VariantPickerModal = ({ isOpen, onClose, item, onAddToCart }) => {
  const [selectedVariants, setSelectedVariants] = useState({});
  const [quantity, setQuantity] = useState(1);

  // Reset state when modal opens with a new item
  useEffect(() => {
    if (isOpen && item) {
      setQuantity(1);
      // Pre-select the first option for each group
      const initialVariants = {};
      MOCK_VARIANT_GROUPS.forEach((group) => {
        initialVariants[group.id] = group.options[0];
      });
      setSelectedVariants(initialVariants);
    }
  }, [isOpen, item]);

  if (!isOpen || !item) return null;

  const handleVariantSelect = (groupId, option) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [groupId]: option,
    }));
  };

  // Calculate prices
  let additionalPrice = 0;
  Object.values(selectedVariants).forEach((opt) => {
    additionalPrice += opt.priceAdjustment;
  });

  const basePrice = Number(item.price);
  const pricePerQuantity = basePrice + additionalPrice;
  const totalPrice = pricePerQuantity * quantity;

  const handleConfirm = () => {
    onAddToCart({
      item,
      quantity,
      selectedVariants,
      pricePerQuantity,
      totalPrice,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-[#1a1a1a] p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#f5f5f5]">{item.name}</h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-[#ababab] hover:bg-[#2a2a2a] hover:text-[#f5f5f5] transition-colors"
          >
            <AiOutlineClose size={24} />
          </button>
        </div>

        {/* Base Price info */}
        <div className="mb-6 flex justify-between items-center text-[#ababab]">
          <span>Base Price:</span>
          <span className="font-semibold text-[#f5f5f5]">PKR {basePrice}</span>
        </div>

        {/* Variant Groups */}
        <div className="space-y-6 max-h-[50vh] overflow-y-auto scrollbar-hide">
          {MOCK_VARIANT_GROUPS.map((group) => (
            <div key={group.id} className="space-y-3">
              <h3 className="text-lg font-semibold text-[#f5f5f5]">{group.name}</h3>
              <div className="grid grid-cols-2 gap-3">
                {group.options.map((option) => {
                  const isSelected = selectedVariants[group.id]?.id === option.id;
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleVariantSelect(group.id, option)}
                      className={`flex flex-col items-start justify-center rounded-xl border p-3 transition-all ${
                        isSelected
                          ? "border-[#02ca3a] bg-[#2e4a40] text-[#f5f5f5]"
                          : "border-[#383838] bg-[#1f1f1f] text-[#ababab] hover:border-[#555] hover:bg-[#2a2a2a]"
                      }`}
                    >
                      <span className="font-medium">{option.name}</span>
                      <span className="text-xs opacity-80 mt-1">
                        {option.priceAdjustment > 0
                          ? `+PKR ${option.priceAdjustment}`
                          : "Included"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <hr className="my-6 border-[#2a2a2a] border-t-2" />

        {/* Quantity & Add to Cart */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center justify-between bg-[#1f1f1f] px-4 py-3 rounded-xl gap-6 flex-1 border border-[#383838]">
            <button
              onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
              className="text-yellow-500 text-2xl hover:text-yellow-400"
            >
              &minus;
            </button>
            <span className="text-white font-bold text-lg">{quantity}</span>
            <button
              onClick={() => setQuantity((prev) => Math.min(10, prev + 1))}
              className="text-yellow-500 text-2xl hover:text-yellow-400"
            >
              &#43;
            </button>
          </div>

          <button
            onClick={handleConfirm}
            className="flex-1 rounded-xl bg-[#02ca3a] py-4 text-center font-bold text-[#1a1a1a] hover:bg-[#02e040] transition-colors"
          >
            Add - PKR {totalPrice}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VariantPickerModal;
