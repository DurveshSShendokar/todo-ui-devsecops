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

export const useGetUserDocumentByUser = () => {
  return useQuery({
    queryKey: ["useGetUserDocumentByUser"],
    queryFn: () =>
      fetchData(`/api/documents/documents/805?pageNo=1&perPage=10`),
  });
};

export const useGetUserSharedDocumentByUser = () => {
  return useQuery({
    queryKey: ["useGetUserSharedDocumentByUser"],
    queryFn: () =>
      fetchData(`/api/document-sharing/shared-with-user/805`),
  });
};



export const useUploadDocument = () => {
      const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetchData(`/api/documents/uploadFile`, {
        method: "POST",
        body: formData,
      });
    if (!response.ok) {
        throw new Error("Failed to create document");
      }

      return response.json();
    },
    onSuccess: (data) => {
      if (onSuccess) onSuccess(data);
      queryClient.invalidateQueries({ queryKey: ["useGetUserDocumentByUser"] });
    },
    onError: (error) => {
      if (onError) onError(error);
    },
  });
};


export const useCreateDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const response = await fetchData(`/api/documents/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to create document");
      }

      return response.json();
    },
    onSuccess: (data) => {
      if (onSuccess) onSuccess(data);
      queryClient.invalidateQueries({ queryKey: ["useGetUserDocumentByUser"] });
    },
    onError: (error) => {
      if (onError) onError(error);
    },
  });
};



export const useDeleteUserDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ documentId, userId }) =>
      fetchData(`/api/documents/delete?documentId=${documentId}&userId=${userId}`, {
        method: "DELETE",
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["useGetUserDocumentByUser"] });
      if (onSuccess) onSuccess(data);
    },
    onError,
  });
};

