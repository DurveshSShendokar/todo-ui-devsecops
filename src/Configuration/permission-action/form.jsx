import React, { useState, useEffect } from "react";
import { Select, MenuItem, FormControl, InputLabel, Button, FormHelperText } from "@mui/material";
import { useTheme } from "next-themes";
import { useGetPermissions } from "./hooks";
import { CategoryJson } from "../../Context/CategoryJson";


const PermissionActionForm = ({ defaultValues, formId, onSubmit }) => {
  const { theme } = useTheme();
  const inputVariant = theme === "dark" ? "outlined" : "filled"; // Material UI uses 'outlined' or 'filled' as variants for input fields

  const [selectedPermissionName, setSelectedPermissionName] = useState("");
  const [selectedPermissionId, setSelectedPermissionId] = useState(null);
  const [selectedAction, setSelectedAction] = useState("");
  const [actions, setActions] = useState([]);
  const { data: allPermissions } = useGetPermissions();

  // Handle permission change
  const handlePermissionChange = (event) => {
    const selectedPermission = event.target.value;
    setSelectedPermissionName(selectedPermission);

    // Find the permission object based on the selected name
    const selectedPermissionData = allPermissions?.find(
      (perm) => perm.permissionsName === selectedPermission
    );

    if (selectedPermissionData) {
      setSelectedPermissionId(selectedPermissionData.permissionsId);
    }
  };

  // Populate actions based on selected permission
  useEffect(() => {
    const permissionValues = Object.values(CategoryJson).flat();

    const selectedPermissionData = permissionValues.find(
      (perm) => perm.permissionsName === selectedPermissionName
    );
    setActions(selectedPermissionData?.actions || []);
  }, [selectedPermissionName]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (selectedPermissionId && selectedAction) {
      const payload = {
        permissions: { permissionsId: selectedPermissionId },
        actionName: selectedAction,
      };

      onSubmit(payload);
    } else {
      console.error("Permission and action must be selected.");
    }
  };

  return (
    <form id={formId} onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-4">
        {/* Permission Dropdown using Material UI Select */}
        <FormControl fullWidth variant={inputVariant}>
          {/* <InputLabel>Permission</InputLabel> */}
          <Select
            value={selectedPermissionName}
            onChange={handlePermissionChange}
            label="Permission"
            displayEmpty
          >
            <MenuItem value="" disabled>
              Select Permission
            </MenuItem>
            {allPermissions?.map((perm) => (
              <MenuItem key={perm.permissionsName} value={perm.permissionsName}>
                {perm.permissionsName}
              </MenuItem>
            ))}
          </Select>
          {!selectedPermissionName && (
            <FormHelperText error>Permission is required</FormHelperText>
          )}
        </FormControl>

        {/* Action Dropdown using Material UI Select */}
        <FormControl fullWidth variant={inputVariant} disabled={!selectedPermissionName || actions.length === 0}>
          {/* <InputLabel>Action</InputLabel> */}
          <Select
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
            label="Action"
            displayEmpty
          >
            <MenuItem value="" disabled>
              Select Action
            </MenuItem>
            {actions.map((action) => (
              <MenuItem key={action} value={action}>
                {action}
              </MenuItem>
            ))}
          </Select>
          {!selectedAction && selectedPermissionName && (
            <FormHelperText error>Action is required</FormHelperText>
          )}
        </FormControl>
      </div>

      {/* Submit Button */}
      <Button type="submit" variant="contained" color="primary" fullWidth>
        Submit
      </Button>
    </form>
  );
};

export default PermissionActionForm;
