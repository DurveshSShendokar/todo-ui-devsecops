import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

export default function SelectSmall({ status, handleChange }) {
  return (
    <FormControl
      fullWidth
      size="small"
      sx={{
        m: 1,
        minWidth: 150,
      }}
    >
      <InputLabel id="task-status-label">Task Status</InputLabel>
      <Select
        labelId="task-status-label"
        id="task-status-select"
        value={status}
        label="Task Status"
        onChange={handleChange}
      >
        <MenuItem value="todo">To Do</MenuItem>
        <MenuItem value="inprogress">In Progress</MenuItem>
        <MenuItem value="completed">Completed</MenuItem>
      </Select>
    </FormControl>
  );
}
