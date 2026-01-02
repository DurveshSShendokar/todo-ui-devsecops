"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Box,
  Typography,
} from "@mui/material";

import { useDeleteRole, useGetPermissionsActions, usePermissionsRegister, useGetPermissions, useUpdaterole } from "./hooks";
import PermissionActionForm from "./form";

const PermissionActionRoute = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
  const [roleId, setRoleId] = useState(null);
  const [editData, setEditData] = useState("");

  const { data: rowData, isLoading, refetch } = useGetPermissionsActions();
  const { data: allData } = useGetPermissions();

  const addRegisterMutation = usePermissionsRegister();
  const updateRoleMutation = useUpdaterole(roleId);
  const deleteRoleMutation = useDeleteRole(roleId);

  const handleOpenChange = () => {
    setEditData("");
    setRoleId(null);
    setIsModalOpen(true);
  };

  const handleCloseAction = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = (formData) => {
    if (roleId) {
      updateRoleMutation.mutate(formData, {
        onSuccess: () => {
          refetch();
        },
      });
    } else {
      addRegisterMutation.mutate(formData, {
        onSuccess: () => {
          refetch();
        },
      });
    }
    setIsModalOpen(false);
  };

  const confirmDelete = () => {
    if (roleId) {
      deleteRoleMutation.mutate(roleId, {
        onSuccess: () => {
          refetch();
        },
      });
    }
    setIsDeleteConfirmationOpen(false);
  };

  const cancelDelete = () => {
    setIsDeleteConfirmationOpen(false);
  };

  return (
    <div style={{ padding: "20px" }}>
           <Box sx={{
    mt: 2,
    borderRadius: 2,
  }} >
        <Typography variant="h5" fontWeight="bold"  >
             Permission Action
          </Typography> 
      </Box>

      <Button variant="contained" color="primary" onClick={handleOpenChange} sx={{
    mt: 4,
  }} >
        Add Permission Action
      </Button>

      {isLoading ? (
        <CircularProgress style={{ marginTop: 20 }} />
      ) : (
        <TableContainer component={Paper} style={{ marginTop: 20 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Sr No.</TableCell>
                <TableCell>Permissions Name</TableCell>
                <TableCell>Action Name</TableCell>
                <TableCell>Category</TableCell>
                {/* <TableCell>Available</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowData || []).map((row, index) => (
                <TableRow key={row.id || index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{row.permissions?.permissionsName}</TableCell>
                  <TableCell>{row.actionName}</TableCell>
                  <TableCell>{row.permissions?.category}</TableCell>
                  {/* <TableCell>{row.available ? "Yes" : "No"}</TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Add/Edit Modal */}
      <Dialog open={isModalOpen} onClose={handleCloseAction} maxWidth="md" fullWidth>
        <DialogTitle>{roleId ? "Edit Permission Action" : "Add Permission Action"}</DialogTitle>
        <DialogContent>
          <PermissionActionForm
            onSubmit={handleSubmit}
            formId="permissionAction-form"
            defaultValues={editData}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteConfirmationOpen} onClose={cancelDelete}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>Are you sure you want to delete this role?</DialogContent>
        <DialogActions>
          <Button onClick={confirmDelete} color="error">
            Confirm
          </Button>
          <Button onClick={cancelDelete} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PermissionActionRoute;
