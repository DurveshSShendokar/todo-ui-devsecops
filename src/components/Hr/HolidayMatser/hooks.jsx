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

export const useGetHolidays = ({ keyword, year, month, page, size }) => {
  return useQuery({
    queryKey: ["useGetHolidays", keyword, year, month, page, size],
    queryFn: () =>
      fetchData(
        `/api/holidays?keyword=${keyword}&year=${year}&month=${month}&page=${page}&size=${size}`
      ),
  });
};

// Add Holiday
export const useAddHoliday = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newHoliday) =>
      fetchData("/api/holidays", {
        method: "POST",
        body: JSON.stringify(newHoliday),
      }),
    onSuccess: (data) => {  
      onSuccess(data); // Display success message
      queryClient.invalidateQueries({ queryKey: ["useGetHolidays"] });
    },
    onError: (error) => {
      onError(error); // Display error message
    },
  });
};


export const useUpdateHoliday = (editId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) =>
      fetchData(`/api/holidays/${editId}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    onSuccess: (data) => {
      onSuccess(data);
      queryClient.invalidateQueries({ queryKey: ["useGetHolidays"] });
    },
    onError: onError,
  });
};

// Delete Holiday
export const useDeleteHoliday = (holidayId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      fetchData(`/api/holidays/${holidayId}`, {
        method: "DELETE",
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["useGetHolidays"] }); // Invalidate table data
      onSuccess(data.message);
    },
    onError: onError,
  });
};