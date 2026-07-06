import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loadMenuCatalog, saveMenuCatalog } from '../utils/menuCatalog';
import { setCategories } from '../redux/slices/menuSlice';

export const useInitializeData = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeMenu = async () => {
      try {
        const catalog = await loadMenuCatalog();
        dispatch(setCategories(catalog));
        // Save back to Dexie to ensure it's seeded if it was empty
        await saveMenuCatalog(catalog);
      } catch (error) {
        console.error('Error initializing Dexie menu data:', error);
      }
    };

    initializeMenu();
  }, [dispatch]);
};
