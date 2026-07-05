import React, { useState } from "react";
import { GrRadialSelected } from "react-icons/gr";
import { FaCartPlus } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { addItems } from "../../redux/slices/cartSlice";
import { selectMenuCategories } from "../../redux/slices/menuSlice";
import VariantPickerModal from "./VariantPickerModal";


const MenuContainer = () => {
  const categories = useSelector(selectMenuCategories);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedItemForModal, setSelectedItemForModal] = useState(null);
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (categories.length === 0) {
      setSelectedCategoryId("");
      return;
    }

    const selectedCategoryExists = categories.some(
      (category) => category.id === selectedCategoryId
    );

    if (!selectedCategoryExists) {
      setSelectedCategoryId(categories[0].id);
    }
  }, [categories, selectedCategoryId]);

  const selected =
    categories.find((category) => category.id === selectedCategoryId) ||
    categories[0];

  const handleAddToCartFromModal = (data) => {
    const { item, quantity, selectedVariants, pricePerQuantity, totalPrice } = data;
    
    // Generate a variant string ID like "portion-half_type-chicken"
    const variantId = Object.entries(selectedVariants)
      .map(([key, val]) => `${key}-${val.id}`)
      .join("_");

    const variantNameStr = Object.values(selectedVariants)
      .map(v => v.name)
      .join(", ");

    const newObj = { 
      id: new Date().getTime(), 
      name: `${item.name} (${variantNameStr})`, 
      variantId,
      pricePerQuantity, 
      quantity, 
      price: totalPrice 
    };

    dispatch(addItems(newObj));
  };


  return (
    <>
      {categories.length === 0 ? (
        <div className="px-10 py-8">
          <div className="rounded-2xl border border-dashed border-[#383838] bg-[#1a1a1a] px-6 py-10 text-center">
            <h2 className="text-xl font-semibold text-[#f5f5f5]">
              No categories available
            </h2>
            <p className="mt-2 text-sm text-[#ababab]">
              Add a category and some dishes from the dashboard to start taking
              orders.
            </p>
          </div>
        </div>
      ) : (
        <>
      <div className="grid grid-cols-4 gap-4 px-10 py-4 w-[100%]">
        {categories.map((menu) => {
          return (
            <div
              key={menu.id}
              className="flex flex-col items-start justify-between p-4 rounded-lg h-[100px] cursor-pointer"
              style={{ backgroundColor: menu.bgColor }}
              onClick={() => {
                setSelectedCategoryId(menu.id);
              }}
            >
              <div className="flex items-center justify-between w-full">
                <h1 className="text-[#f5f5f5] text-lg font-semibold">
                  {menu.icon} {menu.name}
                </h1>
                {selected.id === menu.id && (
                  <GrRadialSelected className="text-white" size={20} />
                )}
              </div>
              <p className="text-[#ababab] text-sm font-semibold">
                {menu.items.length} Items
              </p>
            </div>
          );
        })}
      </div>

      <hr className="border-[#2a2a2a] border-t-2 mt-4" />

      <div className="grid grid-cols-4 gap-4 px-10 py-4 w-[100%]">
        {selected?.items.length > 0 ? selected.items.map((item) => {
          return (
            <div
              key={item.id}
              onClick={() => setSelectedItemForModal(item)}
              className="flex flex-col items-start justify-between p-4 rounded-lg h-[120px] cursor-pointer hover:bg-[#2a2a2a] bg-[#1a1a1a]"
            >
              <div className="flex items-start justify-between w-full">
                <h1 className="text-[#f5f5f5] text-lg font-semibold">
                  {item.name}
                </h1>
                <button className="bg-[#2e4a40] text-[#02ca3a] p-2 rounded-lg pointer-events-none"><FaCartPlus size={20} /></button>
              </div>
              <div className="flex items-center justify-between w-full">
                <p className="text-[#f5f5f5] text-xl font-bold">
                  PKR {item.price}
                </p>
              </div>
            </div>
          );
        }) : (
          <div className="col-span-4 rounded-xl bg-[#1a1a1a] px-6 py-10 text-center text-sm text-[#ababab]">
            No dishes in this category yet.
          </div>
        )}
      </div>
        </>
      )}

      <VariantPickerModal 
        isOpen={!!selectedItemForModal}
        onClose={() => setSelectedItemForModal(null)}
        item={selectedItemForModal}
        onAddToCart={handleAddToCartFromModal}
      />
    </>
  );
};

export default MenuContainer;
