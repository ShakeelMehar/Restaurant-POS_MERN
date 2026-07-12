import { useDispatch } from "react-redux";
import { getUserData } from "../https";
import { useEffect, useState } from "react";
import { removeUser, setUser } from "../redux/slices/userSlice";

const useLoadData = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        dispatch(removeUser());
        setIsLoading(false);
        return;
      }
      try {
        const res = await getUserData();
        const { data } = res;
        const { _id, name, email, phone, role, restaurantId } = data.data;
        dispatch(setUser({ _id, name, email, phone, role, restaurantId }));
      } catch (error) {
        dispatch(removeUser());
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [dispatch]);

  return isLoading;
};

export default useLoadData;
