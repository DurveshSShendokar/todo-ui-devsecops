import { useMutation, useQuery } from "@tanstack/react-query";
import queryClient from "../../utils/queryClient";
import toast from "react-hot-toast";
import { fetchData } from "../../utils/apiClients";

const onSuccess = (data) => {
  toast.success(data?.message || "Operation Successful");
  queryClient.invalidateQueries(["getPermissionsAndActionByRole"]);
};

const onError = (error) => {
  toast.error(error?.message || "Operation Failed");
};

export const getPermissionsAndActionByRole = (roleId, userId) => {
  return useQuery({
    queryKey: ["getPermissionsAndActionByRole2", roleId, userId],
    queryFn: () =>
      fetchData(
        `/access/getPermissionsAndActionByRole2?roleId=${roleId}&userId=${userId}`
      ),
    onSuccess,
    onError,
    enabled: !!roleId && !!userId,
  });
};

export const updateRolePermission = () => {
  return useMutation({
    mutationFn: (data) =>
      fetchData("/access/updateRolePermission", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess,
    onError,
  });
};
export const updateRolePermissionAction = () => {
  return useMutation({
    mutationFn: (data) =>
      fetchData("/access/updateRolePermissionAction", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess,
    onError,
  });
};
