import { useEffect } from "react";
import { axiosPrivate } from "../apis/axios";

export const useAxiosPrivate = () => {
  useEffect(() => {
    const responseInterceptor = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        return Promise.reject(new Error(error));
      }
    );
    return () => {
      axiosPrivate.interceptors.response.eject(responseInterceptor);
    };
  }, []);
  return axiosPrivate;
};

export default useAxiosPrivate;
