import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { fetchData } from '../../../utils/apiClient';
import { showToast, ToastTypes } from '../../toast';

// Success and Error Handlers
const onSuccess = (data) => {
    showToast(data?.message || "Operation Successful", ToastTypes.success);
};

const onError = (error) => {
     showToast(error?.message || "Operation Failed", ToastTypes.error);
};





export const useGetPendingAprovals = (userId,selectedMonth,selectedYear) => {
  // Build the API URL based on provided parameters
  const buildApiUrl = () => {
    const params = {};

    if (userId) params["userId"] = userId;
    if (selectedMonth) params["month"] = selectedMonth;
    if (selectedYear) params["year"] = selectedYear;

    const queryString = new URLSearchParams(params).toString();

    return `/api/attendance-approval/pending?${queryString}`;
  };

  return useQuery({
    queryKey: ["useGetPendingAprovals", userId,selectedMonth,selectedYear],
    queryFn: () => fetchData(buildApiUrl()), 
  });
};



export const useGetAllAprovals = () => {
  return useQuery({
    queryKey: ["useGetAllAprovals"],
    queryFn: () =>
      fetchData(`/api/attendance-approval/all`),
  });
};



export const useUpdateAttendanceApproval = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      return fetchData(`/api/attendance-approval/update/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
        //   onSuccess(data);
      queryClient.invalidateQueries({ queryKey: ["useGetAllAprovals"] });
      queryClient.invalidateQueries({ queryKey: ["useGetPendingAprovals"] });
    },
    onError: (error) => {
     onError(error);
    },
  });
};

export const useUpdateAttendanceStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status, isApproved }) =>
      fetchData(`/api/attendance-approval/update-status/${id}?status=${status}&isApproved=${isApproved}`, {
        method: "PUT",
      }),
    onSuccess: (data) => {
        onSuccess(data);
      queryClient.invalidateQueries({ queryKey: ["useGetPendingAprovals"] });
         queryClient.invalidateQueries({ queryKey: ["useGetAllAprovals"] });
    },
    onError: (error) => {
    onError(error);
    },
  });
};