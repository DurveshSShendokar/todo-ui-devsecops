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

export const useGetAllAutoAttendanceUser = () => {
  return useQuery({
    queryKey: ["useGetAllAutoAttendanceUser"],
    queryFn: () =>
      fetchData("/api/auto-attendance/all"),
  });
};



export const useCreateAutoAttendanceBulk = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newHoliday) =>
      fetchData("/api/auto-attendance/bulk-upsert", {
        method: "POST",
        body: JSON.stringify(newHoliday),
      }),
    onSuccess: (data) => {  
      onSuccess(data); // Display success message
      queryClient.invalidateQueries({ queryKey: ["useGetAllAutoAttendanceUser"] });
    },
    onError: (error) => {
      onError(error); // Display error message
    },
  });
};


export const useUpdateAutoAttendanceUserBulk = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newHoliday) =>
      fetchData("/api/auto-attendance/signinUpdate", {
        method: "POST",
        body: JSON.stringify(newHoliday),
      }),
    onSuccess: (data) => {  
      onSuccess(data); // Display success message
      queryClient.invalidateQueries({ queryKey: ["useGetAllAutoAttendanceUser"] });
    },
    onError: (error) => {
      onError(error); // Display error message
    },
  });
};

export const useCreateAutoAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newHoliday) =>
      fetchData("/api/auto-attendance/create", {
        method: "POST",
        body: JSON.stringify(newHoliday),
      }),
    onSuccess: (data) => {  
      onSuccess(data); // Display success message
      queryClient.invalidateQueries({ queryKey: ["useGetAllAutoAttendanceUser"] });
    },
    onError: (error) => {
      onError(error); // Display error message
    },
  });
};

export const useUpdateAutoAttendanceUser = (userId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) =>
      fetchData(`/api/auto-attendance/update/${userId}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    onSuccess: (data) => {
      onSuccess(data);
      queryClient.invalidateQueries({ queryKey: ["useGetAllAutoAttendanceUser"] });
    },
    onError: onError,
  });
};