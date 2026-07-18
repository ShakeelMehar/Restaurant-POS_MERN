import React, { useState, useEffect } from "react";
import { FiPlus } from "react-icons/fi";
import { getDishImage } from "../../utils/dishImages";

const DishCard = ({ variant, onAdd }) => {
  const itemDetails = variant.originalItemDetails || {};
  const hasPortions = itemDetails.hasPortions;
  const dishImage = getDishImage(itemDetails.name || variant.name, itemDetails.category);
  
  const portionsConfig = itemDetails.portions || {};
  const availablePortions = [];
  if (portionsConfig.quarter > 0) availablePortions.push({ id: "quarter", label: "Quatr", price: portionsConfig.quarter });
  if (portionsConfig.half > 0) availablePortions.push({ id: "half", label: "Half", price: portionsConfig.half });
  if (portionsConfig.large > 0) availablePortions.push({ id: "large", label: "Large", price: portionsConfig.large });

  const [selectedPortionId, setSelectedPortionId] = useState("");

  useEffect(() => {
    if (hasPortions && availablePortions.length > 0) {
      setSelectedPortionId(availablePortions[0].id);
    } else {
      setSelectedPortionId("");
    }
  }, [hasPortions, itemDetails.id]);

  const getActivePrice = () => {
    if (hasPortions && availablePortions.length > 0) {
      const active = availablePortions.find(p => p.id === selectedPortionId);
      return active ? active.price : variant.price;
    }
    return variant.price;
  };

  const getActiveName = () => {
    if (hasPortions && availablePortions.length > 0) {
      const active = availablePortions.find(p => p.id === selectedPortionId);
      return active ? `${itemDetails.name} (${active.label})` : variant.name;
    }
    return variant.name;
  };

  const handleCardClick = () => {
    const activePrice = getActivePrice();
    const activeName = getActiveName();
    const cartItem = {
      id: new Date().getTime(),
      name: activeName,
      variantId: hasPortions ? `${itemDetails.id}-${selectedPortionId}` : variant.variantId,
      pricePerQuantity: activePrice,
      quantity: 1,
      price: activePrice,
      originalItemDetails: itemDetails
    };
    onAdd(cartItem);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group flex flex-col cursor-pointer active:scale-[0.98] transition-transform duration-150"
    >
      {/* Photo plate — rounded-md clipping, 1:1 aspect, floating add orb */}
      <div className="relative w-full aspect-square overflow-hidden rounded-[14px] bg-[hsl(var(--surface-strong))]">
        {dishImage ? (
          <img
            src={dishImage}
            alt={itemDetails.name || variant.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[hsl(var(--surface-strong))] to-[hsl(var(--border))]">
            <span className="text-3xl opacity-40">🍽️</span>
          </div>
        )}

        {/* Add orb — Airbnb heart position, Rausch-fill on hover */}
        <div className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-foreground shadow-[rgba(0,0,0,0.04)_0_2px_6px,rgba(0,0,0,0.1)_0_4px_8px] backdrop-blur-sm transition-colors group-hover:bg-primary group-hover:text-white">
          <FiPlus size={16} strokeWidth={2.5} />
        </div>
      </div>

      {/* Meta block */}
      <div className="pt-2 pb-1">
        <h3 className="text-[14px] font-semibold leading-tight text-foreground truncate">
          {itemDetails.name || variant.name}
        </h3>

        {/* Portion toggles */}
        {hasPortions && availablePortions.length > 0 && (
          <div className="flex gap-1 mt-1.5 flex-wrap" onClick={(e) => e.stopPropagation()}>
            {availablePortions.map((portion) => {
              const isSelected = selectedPortionId === portion.id;
              return (
                <button
                  key={portion.id}
                  onClick={() => setSelectedPortionId(portion.id)}
                  className={`px-2 py-0.5 rounded-[9999px] text-[10px] font-bold uppercase tracking-wide transition-all duration-150 ${
                    isSelected
                      ? "bg-foreground text-[hsl(var(--background))]"
                      : "bg-[hsl(var(--surface-strong))] text-muted hover:text-foreground"
                  }`}
                >
                  {portion.label}
                </button>
              );
            })}
          </div>
        )}

        <p className="mt-1 text-[14px] text-foreground">
          <span className="font-semibold">PKR {getActivePrice()}</span>
        </p>
      </div>
    </div>
  );
};

const CascadingMenu = ({ categories, onAdd }) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState("");

  useEffect(() => {
    if (categories.length > 0 && !selectedCategoryId) {
      setSelectedCategoryId(categories[0].id);
    }
  }, [categories, selectedCategoryId]);

  const handleCategoryClick = (categoryId) => {
    setSelectedCategoryId(categoryId);
  };

  const selectedCategory = categories.find((c) => c.id === selectedCategoryId) || categories[0];

  const generateItemVariants = (item) => {
    if (!item || !item.optionGroups || item.optionGroups.length === 0) {
      return [{
        id: "default",
        name: item.name,
        price: Number(item.price),
        variantId: "default",
        options: []
      }];
    }

    const groups = item.optionGroups;
    let variants = [];

    const backtrack = (groupIndex, currentVariantNameParts, currentVariantIdParts, currentPrice, currentOptions) => {
      if (groupIndex === groups.length) {
        const finalName = currentVariantNameParts.length > 0 ? `${item.name} (${currentVariantNameParts.join(', ')})` : item.name;
        const variantId = currentVariantIdParts.length > 0 ? currentVariantIdParts.sort().join('_') : 'default';
        variants.push({
          id: variantId,
          name: finalName,
          price: currentPrice,
          variantId: variantId,
          options: currentOptions
        });
        return;
      }

      const group = groups[groupIndex];
      if (group.options && group.options.length > 0) {
        group.options.forEach(opt => {
          backtrack(
            groupIndex + 1,
            [...currentVariantNameParts, opt.name],
            [...currentVariantIdParts, `${group.id}-${opt.id}`],
            currentPrice + (Number(opt.extraPrice) || 0),
            [...currentOptions, { groupName: group.name, optionName: opt.name }]
          );
        });
      } else {
        backtrack(groupIndex + 1, currentVariantNameParts, currentVariantIdParts, currentPrice, currentOptions);
      }
    };

    backtrack(0, [], [], Number(item.price), []);
    return variants;
  };

  const categoryVariants = selectedCategory 
    ? selectedCategory.items.flatMap(item => generateItemVariants(item).map(v => ({ ...v, originalItemDetails: item })))
    : [];

  const handleVariantClick = (variant) => {
    const cartItem = {
      id: new Date().getTime(),
      name: variant.name,
      variantId: variant.variantId,
      pricePerQuantity: variant.price,
      quantity: 1,
      price: variant.price,
      originalItemDetails: variant.originalItemDetails
    };

    onAdd(cartItem);
  };

  if (categories.length === 0) return null;

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background">
      {/* ROW 1: TOP CATEGORIES (Fixed Height) */}
      <div 
        className="px-4 py-3 flex gap-2 overflow-x-auto hide-scrollbar flex-shrink-0 z-10 border-b border-border bg-card touch-pan-x"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {categories.map((c) => {
          const isActive = selectedCategoryId === c.id;
          return (
            <button
              key={c.id}
              onClick={() => handleCategoryClick(c.id)}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-[9999px] text-[13px] font-semibold whitespace-nowrap flex-shrink-0 transition-colors ${
                isActive
                  ? "bg-foreground text-[hsl(var(--background))]"
                  : "bg-card border border-[hsl(var(--border-strong))] text-foreground hover:border-foreground"
              }`}
            >
              <span>{c.icon}</span>
              <span>{c.name}</span>
            </button>
          );
        })}
      </div>

      {/* ITEMS GRID */}
      <div className="flex flex-col flex-1 overflow-hidden bg-background">
        {selectedCategory && (
          <div className="px-3 sm:px-4 pt-4 pb-20 lg:pb-4 overflow-y-auto hide-scrollbar flex-1 min-h-0" style={{ WebkitOverflowScrolling: 'touch' }}>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-3 gap-y-5 sm:gap-x-4 sm:gap-y-6">
              {categoryVariants.length > 0 ? (
                categoryVariants.map((variant, index) => (
                  <DishCard
                    key={`${variant.id}-${index}`}
                    variant={variant}
                    onAdd={handleVariantClick}
                  />
                ))
              ) : (
                <div className="col-span-full rounded-[14px] bg-card border border-border px-6 py-12 text-center">
                  <span className="text-4xl mb-3 block">🫙</span>
                  <p className="text-[16px] font-medium text-foreground">No dishes in this category yet.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CascadingMenu;
