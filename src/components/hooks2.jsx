import { useMutation, useQuery } from "@tanstack/react-query";
import queryClient from "../../utils/queryClient";
import toast from "react-hot-toast";
import { fetchData } from "../../utils/apiClients";


const onSuccess = (data, queryKey) => {
  toast.success(data?.message || "Operation Successful");
  if (queryKey) {
    queryClient.invalidateQueries(queryKey);
  }
};

const onError = (error) => {
  toast.error(error?.message || "Operation Failed");
};

export const getAllRoles = () => {
  return useQuery({
    queryKey: ["getAllRoles"],
    queryFn: () => fetchData(`/user/getAllRoles`),
    onSuccess: (data) => onSuccess(data, ["getAllRoles"]),
    onError,
  });
};

export const addRole = () => {
  return useMutation({
    mutationFn: (data) =>
      fetchData("/access/addRole", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: (data) => {
      onSuccess(data.message, ["getAllRoles"]); // Invalidate permission list after adding
    },
    onError,
  });
};
