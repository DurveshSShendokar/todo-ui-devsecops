"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Divider,
  Paper,
} from "@mui/material";
import {
  useGetPermissionsAndActionsByRole,
  useGetRole,
  useUpdateRolePermissions,
  useUpdateRolePermissionsAction,
} from "./hook";
import RolePermissionCard from "./rolePermissionCard";

const RolePermission = ({darkMode}) => {
  const [selectedRole, setSelectedRole] = useState("");
  const [permissionsData, setPermissionsData] = useState([]);

  // Hooks for API
  const { data: rowData } = useGetRole();
  const roleData = rowData || [];
  const { data: perData } = useGetPermissionsAndActionsByRole(selectedRole);
  const { mutate: updateRolePermission } = useUpdateRolePermissions();
  const { mutate: updateRolePermissionAction } = useUpdateRolePermissionsAction();

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
  };

  const handlePermissionToggle = (categoryIndex, permissionsId, isChecked) => {
    const updatedData = [...permissionsData];
    const permission = updatedData[categoryIndex].permissions.find(
      (perm) => perm.permissionsId === permissionsId
    );
    if (permission) {
      permission.selected = isChecked;
    }
    setPermissionsData(updatedData);

    const payload = {
      roleId: selectedRole,
      permissionId: permissionsId,
      selected: isChecked,
    };

    updateRolePermission(payload);
  };

  const handleActionToggle = (
    categoryIndex,
    permissionsId,
    actionIndex,
    isChecked
  ) => {
    const updatedData = [...permissionsData];
    const permission = updatedData[categoryIndex].permissions.find(
      (perm) => perm.permissionsId === permissionsId
    );
    if (permission) {
      const action = permission.actions[actionIndex];
      if (action) {
        action.selected = isChecked;
      }
    }

    setPermissionsData(updatedData);

    const payload = {
      roleId: selectedRole,
      permissionId: permissionsId,
      actionName: updatedData[categoryIndex].permissions.find(
        (perm) => perm.permissionsId === permissionsId
      )?.actions[actionIndex]?.actionName,
      selected: isChecked,
    };

    updateRolePermissionAction(payload);
  };

  useEffect(() => {
    if (perData) {
      const groupedPermissions = {};

      Object.keys(perData).forEach((category) => {
        if (Array.isArray(perData[category])) {
          perData[category].forEach((permission) => {
            const {
              category: permissionCategory,
              permissionsName,
              permissionsId,
              actions,
              selected,
            } = permission;

            if (!groupedPermissions[permissionCategory]) {
              groupedPermissions[permissionCategory] = [];
            }

            groupedPermissions[permissionCategory].push({
              permissionsId,
              permissionsName,
              selected,
              actions: actions.map((action) => ({
                actionName: action.actionName,
                selected: action.selected,
              })),
            });
          });
        }
      });

      const mappedPermissionsData = Object.keys(groupedPermissions).map(
        (category) => ({
          name: category,
          permissions: groupedPermissions[category],
        })
      );

      setPermissionsData(mappedPermissionsData);
    }
  }, [perData]);

  return (
    <div >  
      <Box sx={{
    mt: 4,
    borderRadius: 2,
  }} >
        <Typography variant="h5" fontWeight="bold"  >
            Role Permission
          </Typography> 
      </Box>
       
<Box
  sx={{
    p: 4,
    mt: 4,
    borderRadius: 2,
    backgroundColor: darkMode ? "#1e1e1e" : "#fff",
  }}
>
    
      {/* Role Selection Dropdown */}
    <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
   <Typography variant="h6" fontWeight="bold" sx={{ mr: 2 , mt:1 }}>
  Select Role :
</Typography>
  <FormControl sx={{ width: 300 }}>
    {/* Front Label */}
  

    <InputLabel id="role-select-label">Role</InputLabel>
    <Select
      labelId="role-select-label"
      value={selectedRole}
      label="Role"
      onChange={handleRoleChange}
    >
      {roleData.map((role) => (
        <MenuItem key={role.roleId} value={role.roleId}>
          {role.roleName}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
</Box>

      {/* Permissions Grid */}
      {selectedRole && (
        <Box>
          {permissionsData.map((category, categoryIndex) => (
            <Box key={category.name} sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                {category.name}
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                {category.permissions.map((permission, permissionIndex) => (
                  <Grid item xs={12} sm={6} md={4} key={`${permission.permissionsName}-${permissionIndex}`}>
                    <RolePermissionCard
                      permissionsName={permission.permissionsName}
                      actions={permission.actions}
                      selected={permission.selected}
                      onPermissionChange={(isChecked) =>
                        handlePermissionToggle(
                          categoryIndex,
                          permission.permissionsId,
                          isChecked
                        )
                      }
                      onActionChange={(actionIndex, isChecked) =>
                        handleActionToggle(
                          categoryIndex,
                          permission.permissionsId,
                          actionIndex,
                          isChecked
                        )
                      }
                      darkMode={darkMode}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))}
        </Box>
      )}
    </Box>
    </div>
  );
};

export default RolePermission;
