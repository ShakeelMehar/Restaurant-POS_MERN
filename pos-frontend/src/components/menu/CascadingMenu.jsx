import React, { useState, useEffect } from "react";
import { FiPlus, FiMinus, FiShoppingCart } from "react-icons/fi";

const CascadingMenu = ({ categories, onAdd }) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedItemId, setSelectedItemId] = useState(null);

  // Variant States
  const [itemSelections, setItemSelections] = useState({});
  const [itemQuantity, setItemQuantity] = useState(1);

  useEffect(() => {
    if (categories.length > 0 && !selectedCategoryId) {
      setSelectedCategoryId(categories[0].id);
    }
  }, [categories, selectedCategoryId]);

  const handleCategoryClick = (categoryId) => {
    setSelectedCategoryId(categoryId);
    setSelectedItemId(null); // Instantly collapse Row 3
  };

  const selectedCategory = categories.find((c) => c.id === selectedCategoryId) || categories[0];
  const selectedItem = selectedCategory?.items?.find((i) => i.id === selectedItemId);

  const handleItemClick = (item) => {
    if (selectedItemId === item.id) {
      setSelectedItemId(null); // Toggle off if clicked again
    } else {
      setSelectedItemId(item.id);
      // Initialize defaults for variants
      const defaults = {};
      if (item.optionGroups?.length > 0) {
        item.optionGroups.forEach(group => {
          if (group.options?.length > 0 && group.required) {
            defaults[group.id] = group.options[0].id;
          }
        });
      }
      setItemSelections(defaults);
      setItemQuantity(1);
    }
  };

  const handleSelectionChange = (groupId, optionId) => {
    setItemSelections(prev => ({
      ...prev,
      [groupId]: optionId
    }));
  };

  const calculateItemUnitPrice = () => {
    if (!selectedItem) return 0;
    let unitPrice = Number(selectedItem.price);
    if (selectedItem.optionGroups) {
      selectedItem.optionGroups.forEach(group => {
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
    if (!selectedItem) return;
    const unitPrice = calculateItemUnitPrice();
    const totalPrice = unitPrice * itemQuantity;

    let selectedNames = [];
    let variantParts = [];

    if (selectedItem.optionGroups) {
      selectedItem.optionGroups.forEach(group => {
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
    const finalName = selectedNames.length > 0 ? `${selectedItem.name} (${selectedNames.join(', ')})` : selectedItem.name;

    const cartItem = {
      id: new Date().getTime(),
      name: finalName,
      variantId: variantId,
      pricePerQuantity: unitPrice,
      quantity: itemQuantity,
      price: totalPrice,
      originalItemDetails: selectedItem
    };

    onAdd(cartItem);
    setSelectedItemId(null); // Collapse variants after adding to cart
  };

  if (categories.length === 0) return null;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* ROW 1: TOP CATEGORIES (Fixed Height) */}
      <div className="px-6 py-4 flex gap-3 overflow-x-auto hide-scrollbar flex-shrink-0 border-b border-border bg-background z-10">
        {categories.map((c) => {
          const isActive = selectedCategoryId === c.id;
          return (
            <button
              key={c.id}
              onClick={() => handleCategoryClick(c.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap flex-shrink-0 transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-primary to-amber-500 text-primary-foreground shadow-md shadow-primary/30"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-card/80"
              }`}
            >
              <span>{c.icon}</span>
              <span>{c.name}</span>
            </button>
          );
        })}
      </div>

      {/* DYNAMIC FLEX CONTAINER FOR ROW 2 AND ROW 3 */}
      <div className="flex flex-col flex-1 overflow-hidden">
        
        {/* ROW 2: ITEMS GRID (Scrollable, takes 100% or 50% space) */}
        {selectedCategory && (
          <div className="px-6 pt-4 pb-4 overflow-y-auto hide-scrollbar flex-1 min-h-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {selectedCategory.items?.length > 0 ? (
                selectedCategory.items.map((item) => {
                  const isSelected = selectedItemId === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleItemClick(item)}
                      className={`group bg-card rounded-xl border cursor-pointer transition-all duration-200 flex flex-col justify-between p-4 min-h-[100px] ${
                        isSelected 
                          ? "border-primary shadow-md ring-1 ring-primary/30 bg-primary/5" 
                          : "border-border hover:border-primary/40 hover:shadow-sm"
                      }`}
                    >
                      <h3 className={`text-[15px] font-bold leading-tight mb-2 ${isSelected ? "text-primary" : "text-foreground"}`}>
                        {item.name}
                      </h3>
                      <div className="flex items-center justify-between mt-auto pt-2">
                        <p className="text-primary text-[15px] font-extrabold">
                          PKR {item.price}
                        </p>
                        <div className={`flex items-center justify-center h-7 w-7 rounded-full border transition-all duration-200 ${
                          isSelected 
                            ? "bg-primary border-primary text-primary-foreground" 
                            : "bg-secondary border-border text-muted-foreground group-hover:bg-primary group-hover:border-primary group-hover:text-primary-foreground"
                        }`}>
                          <FiPlus size={14} />
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full rounded-xl bg-card border border-dashed border-border px-6 py-8 text-center">
                  <span className="text-3xl mb-2 block">🫙</span>
                  <p className="text-sm font-semibold text-muted-foreground">No dishes in this category yet.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ROW 3: MODIFIERS & VARIANTS (Scrollable, takes 50% space when active) */}
        {selectedItem && (
          <div className="px-6 flex flex-col border-t-2 border-primary/20 bg-card/10 h-1/2 flex-shrink-0 transition-all duration-200 ease-in-out">
            <div className="flex-1 overflow-y-auto hide-scrollbar py-4">
              <div className="bg-card/60 border border-border rounded-xl p-4 shadow-sm h-full flex flex-col">
                <div className="flex-1 overflow-y-auto hide-scrollbar">
                  {selectedItem.optionGroups?.length > 0 ? (
                    <div className="flex flex-col gap-4 mb-4">
                      {selectedItem.optionGroups.map(group => (
                        <div key={group.id}>
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="text-foreground font-bold text-sm">{group.name}</h4>
                            {group.required && <span className="bg-primary/10 text-primary border border-primary/20 text-[10px] px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider">Required</span>}
                          </div>
                          
                          {/* Horizontal Grid of Options */}
                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
                            {group.options.map(opt => {
                              const isSelected = itemSelections[group.id] === opt.id;
                              return (
                                <button 
                                  key={opt.id}
                                  onClick={() => handleSelectionChange(group.id, opt.id)}
                                  className={`px-3 py-2 rounded-lg border text-sm font-semibold transition-all text-left flex flex-col justify-center min-h-[50px] ${
                                      isSelected 
                                        ? 'border-primary bg-primary/10 text-foreground shadow-sm ring-1 ring-primary/20' 
                                        : 'border-border bg-card text-muted-foreground hover:border-primary/50 hover:bg-card/80 hover:text-foreground'
                                  }`}
                                >
                                  <div className="mb-0.5 leading-tight">{opt.name}</div>
                                  {opt.extraPrice > 0 ? (
                                    <div className="text-[11px] font-bold text-primary">+PKR {opt.extraPrice}</div>
                                  ) : (opt.extraPrice < 0 ? (
                                    <div className="text-[11px] font-bold text-green-500">-PKR {Math.abs(opt.extraPrice)}</div>
                                  ) : <div className="text-[11px] font-bold opacity-50">Included</div>)}
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>

                {/* Action Bar (Fixed at bottom of Row 3) */}
                <div className="flex flex-col sm:flex-row items-center gap-3 bg-background p-3 rounded-xl border border-border mt-auto flex-shrink-0 shadow-sm">
                  {/* Quantity Controls */}
                  <div className="flex items-center bg-secondary text-foreground rounded-lg font-bold text-base h-10 border border-border w-full sm:w-auto px-1">
                    <button onClick={() => setItemQuantity(Math.max(1, itemQuantity - 1))} className="h-full px-3 hover:text-foreground transition-colors flex items-center justify-center">
                      <FiMinus size={14} />
                    </button>
                    <span className="px-2 min-w-[30px] text-center">{itemQuantity}</span>
                    <button onClick={() => setItemQuantity(itemQuantity + 1)} className="h-full px-3 hover:text-foreground transition-colors flex items-center justify-center">
                      <FiPlus size={14} />
                    </button>
                  </div>
                  
                  {/* Add Button */}
                  <button 
                    onClick={handleAddToCart}
                    className="flex-1 w-full bg-gradient-to-r from-primary to-amber-500 hover:from-primary/90 hover:to-amber-500/90 text-primary-foreground font-bold py-2 px-5 rounded-lg flex justify-between items-center transition-all h-10 text-sm shadow-md"
                  >
                    <span className="flex items-center gap-2">
                      <FiShoppingCart size={15} /> Add to Order
                    </span>
                    <span className="text-sm">PKR {calculateItemUnitPrice() * itemQuantity}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CascadingMenu;
