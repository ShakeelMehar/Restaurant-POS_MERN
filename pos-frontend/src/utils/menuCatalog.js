import { menus as seedMenus } from "../constants";

export const MENU_STORAGE_KEY = "restro-menu-catalog-v1";

const createSeedCatalog = () =>
  seedMenus.map((menu) => ({
    id: `category-${menu.id}`,
    name: menu.name,
    bgColor: menu.bgColor,
    icon: menu.icon,
    items: menu.items.map((item) => ({
      id: `dish-${menu.id}-${item.id}`,
      name: item.name,
      price: Number(item.price),
      category: item.category || menu.name,
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
                  price: Number(item.price) || 0,
                  category: item.category || category.name,
                }))
            : [],
        }))
    : [];

export const loadMenuCatalog = () => {
  if (typeof window === "undefined") {
    return createSeedCatalog();
  }

  try {
    const savedCatalog = window.localStorage.getItem(MENU_STORAGE_KEY);
    if (!savedCatalog) {
      return createSeedCatalog();
    }

    const parsedCatalog = JSON.parse(savedCatalog);
    const sanitizedCatalog = sanitizeCatalog(parsedCatalog);
    return sanitizedCatalog.length > 0 ? sanitizedCatalog : createSeedCatalog();
  } catch (error) {
    return createSeedCatalog();
  }
};

export const saveMenuCatalog = (catalog) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(catalog));
};

export const getTotalDishCount = (catalog) =>
  catalog.reduce((total, category) => total + category.items.length, 0);
