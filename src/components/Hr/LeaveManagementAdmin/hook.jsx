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





export const useGetLeaveRequestForManager = () => {
  return useQuery({
    queryKey: ["useGetBalancedLeaveByUser"],
    queryFn: () =>
      fetchData(`/api/leave-request/?managerId=404`),
  });
};


export const useGetAllEmployeeByManager = (managerId) => {
  return useQuery({
    queryKey: ["useGetAllEmployeeByManager",managerId],
    queryFn: () =>
      fetchData(`/user/${managerId}/employee-count`),
    enabled:!!managerId,
  });
};

export const useGetStatsByManager = () => {
  return useQuery({
    queryKey: ["useGetStatsByManager"],
    queryFn: () =>
      fetchData(`/api/leave-request/404/leave-stats`),
    // enabled:!!managerId,
  });
};

export const useGetAllLeaveRequestByUser = (userId) => {
  return useQuery({
    queryKey: ["useGetAllLeaveRequestByUser"],
    queryFn: () =>
      fetchData(`/api/leave-request/get-all-by-user/${userId}`),
  });
};


export const useCreateLeaveRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, newEntry })  =>
      fetchData(`/api/leave-request/create?userId=${userId}`, {
        method: "POST",
        body: JSON.stringify(newEntry),
      }),
    onSuccess: (data) => {  
      onSuccess(data); // Display success message
      queryClient.invalidateQueries({ queryKey: ["useGetAllLeaveRequestByUser"] });
    },
    onError: (error) => {
      onError(error); // Display error message
    },
  });
};



export const useUpdateLeaveRequestforAproved = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ leaveId }) => {
      return fetchData(`/api/leave-request/${leaveId}/approve`, {
        method: "PUT",
      });
    },
    onSuccess: (data) => {
          onSuccess(data);
      queryClient.invalidateQueries({ queryKey: ["useGetAllLeaveRequestByUser"] });
    },
    onError: (error) => {
     onError(error);
    },
  });
};


export const useUpdateLeaveRequestforReject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ leaveId }) => {
      return fetchData(`/api/leave-request/${leaveId}/reject`, {
        method: "PUT",
      });
    },
    onSuccess: (data) => {
          onSuccess(data);
      queryClient.invalidateQueries({ queryKey: ["useGetAllLeaveRequestByUser"] });
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
      queryClient.invalidateQueries({ queryKey: ["useGetAllLeaveRequestByUser"] });
    },
    onError: (error) => {
    onError(error);
    },
  });
};


