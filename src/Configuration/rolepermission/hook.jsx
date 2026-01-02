import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { fetchData } from "../../utils/apiClient"; // Ensure this returns a Promise with API data
import { showToast, ToastTypes } from "../../components/toast";

const onSuccess = (data) => {
    showToast(data?.message || "Operation Successful", ToastTypes.success);
};

const onError = (error) => {
     showToast(error?.message || "Operation Failed", ToastTypes.error);
};

export const useGetRole = () => {
  return useQuery({
    queryKey: ["useGetRole"],
    queryFn: () => fetchData("/access/getRoles"),
  });
};

export const useGetPermissionsAndActionsByRole = (roleId) => {
  return useQuery({
    queryKey: ["useGetPermissionsAndActionsByRole", roleId],
    queryFn: () => fetchData(`/access/getPermissionsAndActionByRole1?roleId=${roleId}`),
    enabled: !!roleId, 
  });
};

export const useUpdateRolePermissionsAction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) =>
      fetchData("/access/updateRolePermissionAction", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["useGetPermissionsAndActionsByRole"] });
      onSuccess(data);
    },
    onError,
  });
};


export const useUpdateRolePermissions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) =>
      fetchData("/access/updateRolePermission", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["useGetPermissionsAndActionsByRole"] });
      onSuccess(data);
    },
    onError,
  });
};
