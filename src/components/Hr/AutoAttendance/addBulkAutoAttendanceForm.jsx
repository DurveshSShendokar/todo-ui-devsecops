import React, { useState } from "react";
import {
  Box,
  TextField,
  Switch,
  FormControlLabel,
  Button,
  Typography,
} from "@mui/material";
import UserListTable from "./userListTable";

const BulkAutoAttendanceForm = ({
  formId,
  onSubmit,
  userData,
  selectedUsers,
  setSelectedUsers,
}) => {
  const [signInTime, setSignInTime] = useState("");
  const [outTime, setOutTime] = useState(""); // ✅ New state for out time
  const [isActive, setIsActive] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!signInTime || !outTime || selectedUsers.length === 0) {
      alert("Please select users and set both sign-in and out time.");
      return;
    }

    const formData = {
      signInTime,
      outTime, // ✅ Include in payload
      isActive,
    };

    onSubmit(formData);
  };

  return (
    <Box
      component="form"
      id={formId}
      onSubmit={handleSubmit}
      sx={{ display: "flex", flexDirection: "column", gap: 3 }}
    >
      <Typography variant="h6">Auto Attendance Settings</Typography>

      <Box display="flex" gap={3} alignItems="center" flexWrap="wrap">
        <TextField
          type="time"
          label="Sign-In Time"
          value={signInTime}
          onChange={(e) => setSignInTime(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ minWidth: 150 }}
        />

        <TextField
          type="time"
          label="Out Time"
          value={outTime}
          onChange={(e) => setOutTime(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ minWidth: 150 }}
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
      </Box>

      <UserListTable
        userData={userData}
        selectedUsers={selectedUsers}
        setSelectedUsers={setSelectedUsers}
        onAddClick={handleSubmit}
      />

      <Box textAlign="right">
        <Button
          type="submit"
          variant="contained"
          disabled={selectedUsers.length === 0 || !signInTime || !outTime}
        >
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export default BulkAutoAttendanceForm;
