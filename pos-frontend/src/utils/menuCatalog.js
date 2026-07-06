import { menus as seedMenus } from "../constants";
import { db } from "./db";

const createSeedCatalog = () =>
  seedMenus.map((menu) => ({
    id: `category-${menu.id}`,
    name: menu.name,
    bgColor: menu.bgColor,
    icon: menu.icon,
    items: menu.items.map((item) => ({
      id: `dish-${menu.id}-${item.id}`,
      name: item.name,
      description: item.description || "",
      price: Number(item.price),
      category: item.category || menu.name,
      optionGroups: item.optionGroups || [],
    })),
  }));

const sanitizeCatalog = (catalog) =>
  Array.isArray(catalog)
    ? catalog
        .filter((category) => category?.name)
        .map((category, categoryIndex) => ({
          id: category.id || `category-${Date.now()}-${categoryIndex}`,
          name: category.name,
          bgColor: category.bgColor || "#5b45b0",
          icon: category.icon || "+",
          items: Array.isArray(category.items)
            ? category.items
                .filter((item) => item?.name)
                .map((item, itemIndex) => ({
                  id:
                    item.id ||
                    `dish-${categoryIndex}-${itemIndex}-${Date.now()}`,
                  name: item.name,
                  description: item.description || "",
                  price: Number(item.price) || 0,
                  category: item.category || category.name,
                  optionGroups: Array.isArray(item.optionGroups) ? item.optionGroups : [],
                }))
            : [],
        }))
    : [];

export const loadMenuCatalog = async () => {
  if (typeof window === "undefined") {
    return createSeedCatalog();
  }
  try {
    const storedMenu = await db.menu.toArray();
    if (storedMenu && storedMenu.length > 0) {
      const parsedCatalog = storedMenu.map(item => item.data);
      const sanitizedCatalog = sanitizeCatalog(parsedCatalog);
      return sanitizedCatalog.length > 0 ? sanitizedCatalog : createSeedCatalog();
    }
    return createSeedCatalog();
  } catch (error) {
    console.error("Dexie load error:", error);
    return createSeedCatalog();
  }
};

export const saveMenuCatalog = async (catalog) => {
  if (typeof window === "undefined") return;
  try {
    await db.menu.clear();
    const bulkAdd = catalog.map(cat => ({ id: cat.id, data: cat }));
    await db.menu.bulkAdd(bulkAdd);
  } catch (error) {
    console.error("Dexie save error:", error);
  }
};

export const getTotalDishCount = (catalog) =>
  catalog.reduce((total, category) => total + category.items.length, 0);
