import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { showToast, ToastTypes } from '../../toast';
import { fetchData } from '../../../utils/apiClient';
// Success and Error Handlers
const onSuccess = (data) => {
    showToast(data?.message || "Operation Successful", ToastTypes.success);
};

const onError = (error) => {
     showToast(error?.message || "Operation Failed", ToastTypes.error);
};


export const useGetUserAll = () => {
  return useQuery({
    queryKey: ["useGetUserAll"],
    queryFn: () =>
      fetchData(`/user/getAllUsers`),
  });
};

export const useGetAllAttendanceForAdmin = (date, userId,page,size) => {
  return useQuery({
    queryKey: ["useGetAllAttendanceForAdmin",date, userId,page,size],
    queryFn: () =>
      fetchData(`/api/attendance/check-by-date?date=${date}&userId=${userId}&page=${page}&size=${size}`),
    enabled:!!date
  });
};


export const useCreateAttendanceSingle = (userId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newHoliday) =>
      fetchData(`/api/attendance/create?userId=${userId}`, {
        method: "POST",
        body: JSON.stringify(newHoliday),
      }),
    onSuccess: (data) => {  
      onSuccess(data); // Display success message
      queryClient.invalidateQueries({ queryKey: ["useGetAllAttendanceForAdmin"] });
    },
    onError: (error) => {
      onError(error); // Display error message
    },
  });
};

export const useUpdateAttendanceBulk = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newHoliday) =>
      fetchData("/api/attendance/bulk-update", {
        method: "POST",
        body: JSON.stringify(newHoliday),
      }),
    onSuccess: (data) => {  
      onSuccess(data); // Display success message
      queryClient.invalidateQueries({ queryKey: ["useGetAllAttendanceForAdmin"] });
    },
    onError: (error) => {
      onError(error); // Display error message
    },
  });
};

export const useUpdateAttendanceSingle = (Id) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) =>
      fetchData(`/api/attendance/update?id=${Id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    onSuccess: (data) => {
      onSuccess(data);
      queryClient.invalidateQueries({ queryKey: ["useGetAllAttendanceForAdmin"] });
    },
    onError: onError,
  });
};