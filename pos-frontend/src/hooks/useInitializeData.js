import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loadMenuCatalog, saveMenuCatalog } from '../utils/menuCatalog';
import { setCategories } from '../redux/slices/menuSlice';
import { getCategories, getProducts } from '../https/index';

export const useInitializeData = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeMenu = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (navigator.onLine && token) {
          try {
            const [categoriesRes, productsRes] = await Promise.all([
              getCategories(),
              getProducts(),
            ]);

            const backendCategories = categoriesRes.data.data;
            const backendProducts = productsRes.data.data;

            // Map to frontend structure
            const mappedCatalog = backendCategories.map(cat => {
              return {
                id: cat._id,
                name: cat.name,
                bgColor: cat.bgColor,
                icon: cat.icon,
                items: backendProducts
                  .filter(prod => typeof prod.category === 'object' ? prod.category.name === cat.name : prod.category === cat.name)
                  .map(prod => ({
                    id: prod._id,
                    name: prod.name,
                    description: prod.description,
                    price: prod.price,
                    category: typeof prod.category === 'object' ? prod.category.name : prod.category,
                    optionGroups: prod.optionGroups || [],
                    hasPortions: prod.hasPortions || false,
                    portions: prod.portions || { quarter: 0, half: 0, large: 0 }
                  }))
              };
            });

            if (mappedCatalog.length > 0) {
              dispatch(setCategories(mappedCatalog));
              await saveMenuCatalog(mappedCatalog);
              return; // Success, skip fallback
            }
          } catch (apiError) {
             console.error("Backend fetch failed, falling back to Dexie", apiError);
          }
        }
        
        // Fallback to local Dexie cache
        const catalog = await loadMenuCatalog();
        dispatch(setCategories(catalog));
        await saveMenuCatalog(catalog);
      } catch (error) {
        console.error('Error initializing menu data:', error);
      }
    };

    initializeMenu();
  }, [dispatch]);
};
