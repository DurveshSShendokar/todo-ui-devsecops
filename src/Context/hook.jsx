import { fetchData } from "../utils/apiClient";
import { useQuery } from "@tanstack/react-query";


export const useGetPermissionsAndActionsByRole = (roleId) => {
  return useQuery({
    queryKey: ["useGetPermissionsAndActionsByRole",roleId],
    queryFn: () => fetchData(`/access/getPermissionsAndActionByRole1?roleId=${roleId}`),
    enabled:!!roleId,
  });
};