import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Autocomplete,
  TextField,
  Chip,
  Button,
} from "@mui/material";

const AssignTask = ({ taskId }) => {
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/user/getAllUsers`)
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        setAllUsers(data);
      })
      .catch((err) => console.error("Error loading users:", err))
      .finally(() => setLoadingUsers(false));
  }, []);

  const handleAssign = async () => {
    try {
      const res = await axios.post(`${API_BASE_URL}task/assignTask`, {
        taskId,
        userIds: selectedUserIds,
      });

      setAssignedUsers(res.data.data.assignedUsers);
    } catch (err) {
      console.error("Assignment failed:", err);
    }
  };

  return (
    <Box mt={4}>
      <Typography variant="h6" gutterBottom>
        Assign Task to Users
      </Typography>

      <Autocomplete
        multiple
        options={allUsers}
        loading={loadingUsers}
        getOptionLabel={(option) =>
          `${option.firstName} ${option.lastName}`
        }
        isOptionEqualToValue={(option, value) => option.id === value.id}
        onChange={(event, newValue) =>
          setSelectedUserIds(newValue.map((user) => user.id))
        }
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
            placeholder="Start typing..."
            margin="normal"
            fullWidth
          />
        )}
      />

      <Button
        variant="contained"
        color="primary"
        onClick={handleAssign}
        sx={{ mt: 2 }}
      >
        Assign Task
      </Button>

      {assignedUsers.length > 0 && (
        <Box mt={3}>
          <Typography variant="subtitle1">Assigned Users:</Typography>
          <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
            {assignedUsers.map((user) => (
              <Chip
                key={user.id}
                label={`${user.firstName} ${user.lastName}`}
                color="primary"
              />
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default AssignTask;
