// components/AdminAddEditForm.jsx
import React, { useState, useEffect } from "react";
import { TextField, MenuItem, Box } from "@mui/material";

const statusOptions = ["HOLIDAY", "WEEKOFF", "PRESENT", "ABSENT", "HALFDAY"];
const formatTime = (timeStr) => {
  if (!timeStr) return "";
  const [hours, minutes] = timeStr.split(":");
  return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
};

const AdminAddEditForm = ({ initialData = {}, onSubmit, formId }) => {
  const [inTime, setInTime] = useState(formatTime(initialData?.inTime || ""));
  const [outTime, setOutTime] = useState(formatTime(initialData?.outTime || ""));
  const [status, setStatus] = useState(initialData?.status || "");

  useEffect(() => {
    if (initialData) {
      setInTime(formatTime(initialData.inTime || ""));
      setOutTime(formatTime(initialData.outTime || ""));
      setStatus(initialData.status || "");
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ inTime, outTime, status });
  };

  return (
    <form id={formId} onSubmit={handleSubmit}>
      <Box display="flex" flexDirection="column" gap={2}>
        <div className="grid grid-cols-2 gap-4">
          <TextField
            label="In Time"
            type="time"
            value={inTime}
            onChange={(e) => setInTime(e.target.value)}
            fullWidth
          />

          <TextField
            label="Out Time"
            type="time"
            value={outTime}
            onChange={(e) => setOutTime(e.target.value)}
            fullWidth
          />

          <TextField
            select
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            fullWidth
          >
            {statusOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </div>
      </Box>
    </form>
  );
};

export default AdminAddEditForm;
