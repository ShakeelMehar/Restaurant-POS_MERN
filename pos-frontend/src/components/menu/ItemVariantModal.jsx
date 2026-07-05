import React, { useState, useEffect } from "react";
import { FaShoppingCart, FaTimes } from "react-icons/fa";

const ItemVariantModal = ({ item, onClose, onAdd }) => {
  const [itemSelections, setItemSelections] = useState({});
  const [itemQuantity, setItemQuantity] = useState(1);

  // Initialize defaults
  useEffect(() => {
    if (item) {
      const defaults = {};
      if (item.optionGroups && item.optionGroups.length > 0) {
        item.optionGroups.forEach(group => {
          if (group.options && group.options.length > 0 && group.required) {
            defaults[group.id] = group.options[0].id;
          }
        });
      }
      setItemSelections(defaults);
      setItemQuantity(1);
    }
  }, [item]);

  if (!item) return null;

  const handleSelectionChange = (groupId, optionId) => {
    setItemSelections(prev => ({
      ...prev,
      [groupId]: optionId
    }));
  };

  const calculateItemUnitPrice = () => {
    let unitPrice = Number(item.price);
    if (item.optionGroups) {
      item.optionGroups.forEach(group => {
        const selectedOptionId = itemSelections[group.id];
        if (selectedOptionId) {
          const opt = group.options.find(o => o.id === selectedOptionId);
          if (opt && opt.extraPrice) {
            unitPrice += Number(opt.extraPrice);
          }
        }
      });
    }
    return unitPrice;
  };

  const handleAddToCart = () => {
    const unitPrice = calculateItemUnitPrice();
    const totalPrice = unitPrice * itemQuantity;

    let selectedNames = [];
    let variantParts = [];
    
    if (item.optionGroups) {
      item.optionGroups.forEach(group => {
        const selectedOptionId = itemSelections[group.id];
        if (selectedOptionId) {
          const opt = group.options.find(o => o.id === selectedOptionId);
          if (opt) {
            selectedNames.push(opt.name);
            variantParts.push(`${group.id}-${opt.id}`);
          }
        }
      });
    }
    
    const variantId = variantParts.length > 0 ? variantParts.sort().join('_') : 'default';
    const finalName = selectedNames.length > 0 ? `${item.name} (${selectedNames.join(', ')})` : item.name;

    const cartItem = {
      id: new Date().getTime(), // temporary id
      name: finalName,
      variantId: variantId,
      pricePerQuantity: unitPrice,
      quantity: itemQuantity,
      price: totalPrice,
      originalItemDetails: item // useful for later modifications if needed
    };

    onAdd(cartItem);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4">
      <div className="bg-base w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-start p-6 border-b border-[#2a2a2a]">
          <div>
            <h2 className="text-2xl font-bold text-text-primary">{item.name}</h2>
            {item.description && <p className="text-text-secondary mt-1">{item.description}</p>}
          </div>
          <button 
            onClick={onClose}
            className="p-2 bg-[#1a1a1a] hover:bg-[#2a2a2a] text-[#ababab] hover:text-[#f5f5f5] rounded-full transition-colors"
          >
            <FaTimes />
          </button>
        </div>

        {/* Body / Options */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
          {item.optionGroups?.length > 0 ? (
            item.optionGroups.map(group => (
              <div key={group.id} className="mb-8 last:mb-0">
                <div className="flex items-center gap-4 mb-4">
                  <h3 className="text-text-primary font-bold text-lg">{group.name}</h3>
                  {group.required && <span className="bg-[#1f1f1f] text-primary border border-[#383838] text-xs px-2 py-1 rounded-full font-bold uppercase tracking-wider">Required</span>}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {group.options.map(opt => {
                    const isSelected = itemSelections[group.id] === opt.id;
                    return (
                      <button 
                        key={opt.id}
                        onClick={() => handleSelectionChange(group.id, opt.id)}
                        className={`p-3 rounded-xl border text-sm font-semibold transition-all ${
                            isSelected 
                              ? 'border-primary bg-[#1f1f1f] text-primary shadow-sm' 
                              : 'border-[#2a2a2a] bg-[#1a1a1a] text-[#ababab] hover:border-[#383838] hover:text-[#f5f5f5]'
                        }`}
                      >
                        <div className="mb-1">{opt.name}</div>
                        {opt.extraPrice > 0 ? (
                          <div className="text-xs opacity-80">+PKR {opt.extraPrice}</div>
                        ) : (opt.extraPrice < 0 ? (
                          <div className="text-xs opacity-80">-PKR {Math.abs(opt.extraPrice)}</div>
                        ) : null)}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center h-32">
               <p className="text-[#ababab] italic">No additional variants for this item.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[#2a2a2a] bg-[#1a1a1a] rounded-b-2xl">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            
            {/* Quantity Controls */}
            <div className="flex items-center bg-[#2a2a2a] text-[#f5f5f5] rounded-xl font-bold text-xl h-14 border border-[#383838] w-full sm:w-auto px-2">
              <button onClick={() => setItemQuantity(Math.max(1, itemQuantity - 1))} className="px-5 hover:text-primary transition-colors">-</button>
              <span className="px-4 min-w-[50px] text-center">{itemQuantity}</span>
              <button onClick={() => setItemQuantity(itemQuantity + 1)} className="px-5 hover:text-primary transition-colors">+</button>
            </div>
            
            {/* Add Button */}
            <button 
              onClick={handleAddToCart}
              className="flex-1 w-full bg-primary hover:brightness-110 text-[#1a1a1a] font-bold py-3 px-6 rounded-xl flex justify-between items-center transition-all h-14 text-lg shadow-[0_0_15px_rgba(246,177,0,0.2)]"
            >
              <span className="flex items-center gap-2">
                <FaShoppingCart size={18} /> Add to Order
              </span>
              <span>PKR {calculateItemUnitPrice() * itemQuantity}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ItemVariantModal;
