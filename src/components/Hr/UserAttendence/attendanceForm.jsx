import React, { useState } from "react";
import { TextField, MenuItem, Box } from "@mui/material";

const statuses = ["HOLIDAY", "WEEKOFF", "PRESENT", "ABSENT", "HALFDAY"];
const formatTime = (timeStr) => {
  if (!timeStr) return "";
  const [hours, minutes] = timeStr.split(":");
  return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
};

const AttendanceEditForm = ({ initialData, onSubmit, formId }) => {
  const [inTime, setInTime] = useState(formatTime(initialData?.inTime || ""));
  const [outTime, setOutTime] = useState(formatTime(initialData?.outTime || ""));
  const [status, setStatus] = useState(initialData?.status || "");

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      date: initialData?.date,
      inTime,
      outTime,
      status,
    };

    onSubmit(payload); 
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
            // required
          />

          <TextField
            label="Out Time"
            type="time"
            value={outTime}
            onChange={(e) => setOutTime(e.target.value)}
            fullWidth
            // required
          />

          <TextField
            select
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            fullWidth
            // required
          >
            {statuses.map((option) => (
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

export default AttendanceEditForm;
