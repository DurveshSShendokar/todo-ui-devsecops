import {
    Box,
    Button,
    Modal,
    Typography,
    Autocomplete,
    TextField,
    Chip,
    useTheme,
  } from "@mui/material";
  import { useEffect, useState } from "react";
  import { getRequest, postRequest } from "../utils/apiClient";
  import { showToast, ToastTypes } from "./toast";
  import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
  import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
  import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
  
  const AssignModal = ({ open, handleClose, task, refreshTasks }) => {
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [dueDate, setDueDate] = useState(null);
    console.log(dueDate);
    
    const theme = useTheme();
  
    useEffect(() => {
      if (open) fetchUsers();
    }, [open]);
  
    const fetchUsers = async () => {
      const { data } = await getRequest("/user/getAllUsers");
      if (data) setUsers(data.data);
    };
  

    const formatLocalDateTime = (dateStr) => {
  const date = new Date(dateStr);
  const pad = (n) => String(n).padStart(2, '0');

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
};


    const handleAssign = async () => {
      if (!task?.taskId) {
        showToast("Invalid task selected", ToastTypes.error);
        return;
      }
  
      if (selectedUsers.length === 0) {
        showToast("Please select at least one user", ToastTypes.warning);
        return;
      }
  
      const payload = {
        taskId: task.taskId,
        userIds: selectedUsers.map((u) => u.id),
   ...(dueDate ? { dueDate: formatLocalDateTime(dueDate) } : {}),


      };
  
      try {
        const response = await postRequest("/task/assignTask", payload);
        const data = response?.data || response;
  
        if (data) {
          showToast(data.message, ToastTypes.success);
          handleClose();
          refreshTasks();
        } else {
          showToast(data?.message || "Assignment failed", ToastTypes.error);
        }
      } catch (error) {
        console.error("❌ Error assigning task:", error);
        showToast("Internal Server Error", ToastTypes.error);
      }
    };
  
    return (
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            p: 4,
            bgcolor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            borderRadius: 2,
            width: 700,
            maxWidth: "90%",
            mx: "auto",
            mt: "10%",
            boxShadow: 24,
          }}
        >
          <Typography variant="h6" mb={2}>
            Assign Task: {task?.taskName}
          </Typography>
  
          <Autocomplete
            multiple
            options={users}
            getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            onChange={(e, newVal) => setSelectedUsers(newVal)}
            renderTags={(value, getTagProps) =>
              value.map((user, index) => (
                <Chip
                  label={`${user.firstName} ${user.lastName}`}
                  {...getTagProps({ index })}
                  key={user.id}
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Users"
                fullWidth
                size="small"
                variant="outlined"
                margin="normal"
              />
            )}
          />
  
  <LocalizationProvider dateAdapter={AdapterDateFns}>
  <DateTimePicker
    label="Select Due Date & Time"
    value={dueDate}
    onChange={(newValue) => setDueDate(newValue)}
    slotProps={{
      textField: {
        fullWidth: true,
        size: "small",
        margin: "normal",
      }
    }}
  />
</LocalizationProvider>

  
          <Box mt={3} display="flex" justifyContent="flex-end">
            <Button
              onClick={handleClose}
              variant="outlined"
              size="small"
              sx={{ mr: 2 }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={handleAssign}
            >
              Assign
            </Button>
          </Box>
        </Box>
      </Modal>
    );
  };
  
  export default AssignModal;
  