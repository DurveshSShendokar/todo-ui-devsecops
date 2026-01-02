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


export const useGetAttendanceUserAll = ({ userId, month, year }) => {
  return useQuery({
    queryKey: ["useGetAttendanceUserAll", userId, month, year],
    queryFn: () =>
      fetchData(`/api/attendance/attendance/by-user?userId=${userId}&month=${month}&year=${year}`),
    enabled: !!userId && !!month && !!year, // prevents the query from running until all values are defined
  });
};



export const useGetPendingAprovalsForUser = (userId,selectedMonth,selectedYear) => {
  return useQuery({
    queryKey: ["useGetPendingAprovalsForUser",userId,selectedMonth,selectedYear],
    queryFn: () =>
      fetchData(`/api/attendance-approval/pending?userId=${userId}&month=${selectedMonth}&year=${selectedYear}`),
  });
};

export const useCheckIn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, inTime }) =>
      fetchData(`/api/attendance/create?userId=${userId}`, {
        method: "POST",
        body: JSON.stringify({ inTime }),
      }),
    onSuccess: (data) => {
      onSuccess(data);
      queryClient.invalidateQueries({ queryKey: ["useGetAttendanceUserAll"] });
    },
    onError,
  });
};

export const useCheckOut = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ todaysEntry, outTime }) =>
      fetchData(`/api/attendance/update?id=${todaysEntry}`, {
        method: "PUT",
        body: JSON.stringify({ outTime }),
      }),
    onSuccess: (data) => {
      onSuccess(data);
      queryClient.invalidateQueries({ queryKey: ["useGetAttendanceUserAll"] });
    },
    onError,
  });
};


export const useCreateApprovalRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newHoliday) =>
      fetchData("/api/attendance-approval/create", {
        method: "POST",
        body: JSON.stringify(newHoliday),
      }),
    onSuccess: (data) => {  
      onSuccess(data); // Display success message
      queryClient.invalidateQueries({ queryKey: ["useGetAttendanceUserAll"] });
    },
    onError: (error) => {
      onError(error); // Display error message
    },
  });
};