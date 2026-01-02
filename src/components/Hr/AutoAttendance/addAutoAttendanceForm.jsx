import React, { useState } from "react";
import {
  TextField,
  Switch,
  FormControlLabel,
  Box,
  Button,
} from "@mui/material";
import UserListTable from "./userListTable"; // Import the user list table

const AddAutoAttendanceForm = ({
  formId,
  onSubmit,
  userData,
  selectedUsers = [],
  setSelectedUsers,
  selectedAttendanceIds = [],
}) => {
  const [signInTime, setSignInTime] = useState("");
  const [outTime, setOutTime] = useState(""); // 🆕 Add Out-Time state
  const [isActive, setIsActive] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!signInTime || !outTime) {
      alert("Please select both Sign-In and Out-Time.");
      return;
    }

    const payload = {
      signInTime,
      outTime, 
      isActive: isActive ? 1 : 0,
    };

    onSubmit(payload); // Call the parent handler
  };

  return (
    <form id={formId} onSubmit={handleSubmit}>
      <Box display="flex" flexDirection="column" gap={2}>
        <TextField
          type="time"
          label="Sign-In Time"
          value={signInTime}
          onChange={(e) => setSignInTime(e.target.value)}
          InputLabelProps={{ shrink: true }}
          required
        />

        <TextField
          type="time"
          label="Out-Time"
          value={outTime}
          onChange={(e) => setOutTime(e.target.value)}
          InputLabelProps={{ shrink: true }}
          required
        />

        <FormControlLabel
          control={
            <Switch
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
          }
          label="Is Active"
        />

        {selectedAttendanceIds.length === 0 && (
          <UserListTable
            userData={userData}
            selectedUsers={selectedUsers}
            setSelectedUsers={setSelectedUsers}
          />
        )}
      </Box>
    </form>
  );
};

export default AddAutoAttendanceForm;
