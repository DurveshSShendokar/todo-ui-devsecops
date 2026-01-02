import {  useQuery } from '@tanstack/react-query';

import { fetchData } from '../../../utils/apiClient';


export const useGetAllTaskReport = (productId, userId, status, page, size) => {
  // Build the API URL based on provided parameters
  const buildApiUrl = () => {
    const params = {};

    if (productId) params["productId"] = productId;
    if (userId) params["userId"] = userId;
    if (status) params["status"] = status;
    if (page) params["page"] = page;
    if (size) params["size"] = size;

    const queryString = new URLSearchParams(params).toString();

    return `/task/analytics?${queryString}`;
  };

  return useQuery({
    queryKey: ["useGetAllTaskReport", productId, userId, status, page, size],
    queryFn: () => fetchData(buildApiUrl()), // Use the dynamic URL built by the function
    enabled: Boolean(page || size), // Ensure query only runs if any of the parameters are provided
  });
};
export const getAllProductList = () => {
  return useQuery({
    queryKey: ["getAllProductList"],
    queryFn: () =>
      fetchData(`/product/getAllProductList`),
         
  });
};

