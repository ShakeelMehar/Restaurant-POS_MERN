import React, { useState, useEffect } from "react";
import { FaPlus, FaShoppingCart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { addItems } from "../../redux/slices/cartSlice";
import { selectMenuCategories } from "../../redux/slices/menuSlice";
import ItemVariantModal from "./ItemVariantModal";

const MenuContainer = () => {
  const categories = useSelector(selectMenuCategories);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedItemForModal, setSelectedItemForModal] = useState(null);
  
  const dispatch = useDispatch();

  useEffect(() => {
    if (categories.length === 0) {
      setSelectedCategoryId("");
      return;
    }
    const selectedCategoryExists = categories.some((c) => c.id === selectedCategoryId);
    if (!selectedCategoryExists) {
      setSelectedCategoryId(categories[0].id);
    }
  }, [categories, selectedCategoryId]);

  const selected = categories.find((c) => c.id === selectedCategoryId) || categories[0];

  const handleCardClick = (item) => {
    // If the item has variants (options), open the modal
    if (item.optionGroups && item.optionGroups.length > 0) {
      setSelectedItemForModal(item);
    } else {
      // If no variants, just add directly to cart (quantity 1)
      const newObj = {
        id: new Date().getTime(),
        name: item.name,
        variantId: 'default',
        pricePerQuantity: Number(item.price),
        quantity: 1,
        price: Number(item.price),
      };
      dispatch(addItems(newObj));
    }
  };

  const handleAddToCartFromModal = (cartItem) => {
    dispatch(addItems(cartItem));
    setSelectedItemForModal(null);
  };

  return (
    <>
      {categories.length === 0 ? (
        <div className="px-6 py-8 w-full">
          <div className="rounded-2xl border border-dashed border-[#383838] bg-base px-6 py-10 text-center">
            <h2 className="text-xl font-semibold text-text-primary">No categories available</h2>
          </div>
        </div>
      ) : (
        <>
          {/* Top Navigation / Tab Bar */}
          <div className="flex flex-wrap gap-3 px-6 py-4">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategoryId(c.id)}
                className={`px-6 py-2.5 rounded-full font-bold whitespace-nowrap transition-all border ${
                  selectedCategoryId === c.id
                    ? "bg-primary text-[#1a1a1a] border-primary shadow-[0_0_15px_rgba(246,177,0,0.4)]"
                    : "bg-[#1a1a1a] text-[#ababab] hover:text-[#f5f5f5] border-[#2a2a2a]"
                }`}
              >
                {c.icon} {c.name}
              </button>
            ))}
          </div>

          <hr className="border-[#2a2a2a] border-t mt-1 mb-4 mx-6" />

          {/* Sub-Category Items (Card Grid) */}
          <div className="px-6 py-2 w-full h-[calc(100vh-230px)] overflow-y-auto hide-scrollbar pb-32">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {selected?.items?.length > 0 ? (
                selected.items.map((item) => (
                  <div 
                    key={item.id} 
                    onClick={() => handleCardClick(item)}
                    className="bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a] overflow-hidden transition-all hover:border-[#c6893f] hover:shadow-lg cursor-pointer flex flex-col h-full group"
                  >
                    {/* Image Area - Using a sleek placeholder */}
                    <div className="h-32 bg-[#2a2a2a] flex items-center justify-center relative overflow-hidden">
                       <span className="text-5xl group-hover:scale-110 transition-transform duration-300">🍲</span>
                       {/* Gradient overlay for premium feel */}
                       <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] to-transparent opacity-80"></div>
                    </div>
                    
                    {/* Content Area */}
                    <div className="p-4 flex flex-col flex-grow">
                      <div className="flex-grow">
                        <h1 className="text-[#f5f5f5] text-lg font-bold leading-tight mb-1">{item.name}</h1>
                        <p className="text-[#ababab] text-xs line-clamp-2">{item.description}</p>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#2a2a2a]">
                        <p className="text-primary text-lg font-extrabold tracking-wide">PKR {item.price}</p>
                        <div className="h-8 w-8 rounded-full bg-[#2a2a2a] group-hover:bg-primary group-hover:text-[#1a1a1a] text-[#ababab] flex items-center justify-center transition-colors">
                          <FaPlus size={14} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full rounded-2xl bg-[#1a1a1a] px-6 py-10 text-center text-sm text-[#ababab] border border-[#2a2a2a]">
                  No dishes in this category yet.
                </div>
              )}
            </div>
          </div>
          
          {/* Item Variant Modal */}
          <ItemVariantModal 
            item={selectedItemForModal} 
            onClose={() => setSelectedItemForModal(null)} 
            onAdd={handleAddToCartFromModal} 
          />
        </>
      )}
    </>
  );
};

export default MenuContainer;
