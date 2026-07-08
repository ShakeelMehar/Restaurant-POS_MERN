import React, { useState, useEffect } from "react";
import { FiPlus } from "react-icons/fi";

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
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5 sm:gap-3">
              {categoryVariants.length > 0 ? (
                categoryVariants.map((variant, index) => (
                  <div
                    key={`${variant.id}-${index}`}
                    onClick={() => handleVariantClick(variant)}
                    className="card-base card-hover flex flex-col justify-between p-2.5 sm:p-3 min-h-[90px] sm:min-h-[100px] cursor-pointer active:scale-[0.98] transition-transform duration-150 border border-[hsl(var(--border-strong))] rounded-[12px] sm:rounded-[14px]"
                  >
                    <div>
                      <h3 className="text-[13px] font-semibold leading-snug mb-1 text-foreground">
                        {variant.name}
                      </h3>
                    </div>
                    <div className="flex items-center justify-between mt-auto pt-2">
                      <p className="text-foreground text-[13px] font-medium">
                        PKR {variant.price}
                      </p>
                      <div className="flex items-center justify-center h-7 w-7 rounded-full bg-[hsl(var(--surface-strong))] text-foreground hover:bg-foreground hover:text-background transition-colors shadow-sm">
                        <FiPlus size={14} />
                      </div>
                    </div>
                  </div>
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
