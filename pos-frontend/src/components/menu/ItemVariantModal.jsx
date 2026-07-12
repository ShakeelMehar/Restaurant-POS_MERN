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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-background w-full max-w-2xl rounded-[20px] shadow-[rgba(0,0,0,0.02)_0_0_0_1px,rgba(0,0,0,0.08)_0_8px_24px] flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex justify-between items-start p-4 border-b border-border">
          <div>
            <h2 className="text-xl font-bold text-foreground">{item.name}</h2>
            {item.description && <p className="text-muted-foreground mt-1">{item.description}</p>}
          </div>
          <button 
            onClick={onClose}
            className="p-2 bg-card hover:bg-secondary text-muted-foreground hover:text-foreground rounded-full transition-colors"
          >
            <FaTimes />
          </button>
        </div>

        {/* Body / Options */}
        <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
          {item.optionGroups?.length > 0 ? (
            item.optionGroups.map(group => (
              <div key={group.id} className="mb-8 last:mb-0">
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-foreground font-bold text-base">{group.name}</h3>
                  {group.required && <span className="bg-background text-foreground border border-border text-xs px-2 py-1 rounded-full font-bold uppercase tracking-wider">Required</span>}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {group.options.map(opt => {
                    const isSelected = itemSelections[group.id] === opt.id;
                    return (
                      <button 
                        key={opt.id}
                        onClick={() => handleSelectionChange(group.id, opt.id)}
                        className={`p-3 rounded-xl border text-sm font-semibold transition-all ${
                            isSelected 
                              ? 'border-primary bg-background text-foreground shadow-sm' 
                              : 'border-border bg-card text-muted-foreground hover:border-border hover:text-foreground'
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
               <p className="text-muted-foreground italic">No additional variants for this item.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-background">
          <div className="flex flex-col sm:flex-row items-center gap-2">
            
            {/* Quantity Controls */}
            <div className="flex items-center bg-[hsl(var(--surface-strong))] text-foreground rounded-[8px] font-bold text-[16px] h-14 border border-transparent focus-within:border-primary/50 w-full sm:w-auto px-2">
              <button onClick={() => setItemQuantity(Math.max(1, itemQuantity - 1))} className="px-4 hover:text-foreground transition-colors">-</button>
              <span className="px-3 min-w-[50px] text-center">{itemQuantity}</span>
              <button onClick={() => setItemQuantity(itemQuantity + 1)} className="px-4 hover:text-foreground transition-colors">+</button>
            </div>
            
            {/* Add Button */}
            <button 
              onClick={handleAddToCart}
              className="flex-1 w-full bg-primary hover:bg-primary/90 text-white font-bold py-2 px-6 rounded-[8px] flex justify-between items-center transition-colors h-14 text-[16px]"
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
