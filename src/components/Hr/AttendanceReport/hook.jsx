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


export const useGetAllAttendanceReport = (startDate,endDate,userId,page,size) => {
  return useQuery({
    queryKey: ["useGetAllAttendanceReport",startDate,endDate,userId,page,size],
    queryFn: () =>
      fetchData(`/api/attendance/report?startDate=${startDate}&endDate=${endDate}&userId=${userId}&page=${page}&size=${size}`),
    enabled:!!startDate&&!!endDate
  });
};


export const useGetAllAttendanceReportForExport = (startDate,endDate) => {
  return useQuery({
    queryKey: ["useGetAllAttendanceReportForExport",startDate,endDate],
    queryFn: () =>
      fetchData(`/api/attendance/allList?startDate=${startDate}&endDate=${endDate}`),
    enabled:!!startDate&&!!endDate
  });
};