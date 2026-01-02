
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { fetchData } from "../../utils/apiClient";

// Success and Error handlers for toast notifications
const onSuccess = (data) => {
  toast.success(data?.message || "Operation Successful");
};

const onError = (error) => {
  toast.error(error?.message || "Operation Failed");
};

// Hook to get all permissions
export const useGetPermissions = () => {
  return useQuery({
    queryKey: ["useGetPermissions"],
    queryFn: () => fetchData("/access/getAllPermissions"),
  });
};

// Hook to get permission actions
export const useGetPermissionsActions = () => {
  return useQuery({
    queryKey: ["useGetPermissionsActions"],
    queryFn: () => fetchData("/access/getPermissionAction"),
  });
};

// Hook to register a new permission action
export const usePermissionsRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) =>
      fetchData("/access/addPermissionAction", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: (data) => {
      if (data?.message === "Permission Action aleady exists") {
        toast.error("This permission action already exists.");
      } else {
        queryClient.invalidateQueries({ queryKey: ["useGetPermissionsActions"] });
        toast.success("Permission action added successfully.");
      }
    },
    onError: onError,
  });
};

// Hook to update a role
export const useUpdaterole = (roleId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) =>
      fetchData(`/api/roles/${roleId}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["useGetRole"] });
      onSuccess(data);
    },
    onError: onError,
  });
};

// Hook to delete a role
export const useDeleteRole = (roleId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      fetchData(`/api/roles/${roleId}`, {
        method: "DELETE",
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["useGetRole"] });
      onSuccess(data);
    },
    onError: onError,
  });
};
