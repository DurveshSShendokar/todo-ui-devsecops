"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  MenuItem,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import Autocomplete from "@mui/material/Autocomplete";



const Todo = () => {
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [status, setStatus] = useState("Pending");
  const [difficulty, setDifficulty] = useState("Medium");
  const [priority, setPriority] = useState("P1");
  const [productId, setProductId] = useState("");
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/product/getAllProductList`)
      .then((res) => {
        console.log("✅ Product API Response:", res.data);
        setProducts(res.data);
        setLoadingProducts(false);
      })
      .catch((err) => {
        console.error("❌ Failed to fetch products:", err);
        setLoadingProducts(false);
      });
  }, []);

  const handleAddTask = () => {
    const payload = {
      taskName,
      taskDescription,
      status,
      userId: 1,
      product: {
        id: Number(productId),
      },
      difficulty,
      priority,
    };

    axios
      .post(`${API_BASE_URL}/task/addTask`, payload)
      .then((res) => {
        console.log("✅ Task added:", res.data);
        alert("Task Added Successfully!");
      })
      .catch((err) => {
        console.error("❌ Error adding task:", err);
        alert("Failed to add task.");
      });
  };

  return (
    <Box sx={{ p: 4, maxWidth: 600 }}>
      <Typography variant="h5" mb={2}>
        Add Task
      </Typography>

      <TextField
        label="Task Name"
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Task Description"
        value={taskDescription}
        onChange={(e) => setTaskDescription(e.target.value)}
        fullWidth
        margin="normal"
        multiline
        rows={3}
      />
      <TextField
        select
        label="Status"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        fullWidth
        margin="normal"
      >
        <MenuItem value="Pending">Pending</MenuItem>
        <MenuItem value="Completed">Completed</MenuItem>
      </TextField>

      <TextField
        select
        label="Difficulty"
        value={difficulty}
        onChange={(e) => setDifficulty(e.target.value)}
        fullWidth
        margin="normal"
      >
        <MenuItem value="Easy">Easy</MenuItem>
        <MenuItem value="Medium">Medium</MenuItem>
        <MenuItem value="Hard">Hard</MenuItem>
      </TextField>

      <TextField
        select
        label="Priority"
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        fullWidth
        margin="normal"
      >
        <MenuItem value="P1">P1</MenuItem>
        <MenuItem value="P2">P2</MenuItem>
        <MenuItem value="P3">P3</MenuItem>
      </TextField>

      <Autocomplete
        options={products}
        getOptionLabel={(option) => option.productName || ""}
        loading={loadingProducts}
        onChange={(event, newValue) => {
          setProductId(newValue ? String(newValue.id) : "");
        }}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Product"
            margin="normal"
            fullWidth
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loadingProducts ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />

      <Button
        variant="contained"
        color="primary"
        onClick={handleAddTask}
        sx={{ mt: 2 }}
      >
        Add Task
      </Button>
    </Box>
  );
};

export default Todo;
