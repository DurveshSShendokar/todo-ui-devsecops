import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  IconButton,
  TextField,
  MenuItem,
  Button,
  Autocomplete,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useGetUserAll } from "../Hr/AutoAttendance/hook";
import { getRequest, postRequest } from "../../utils/apiClient";
import { showToast, ToastTypes } from "../toast";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: 800,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
  maxHeight: "90vh",
//   overflowY: "auto",
};

const EditTaskModal = ({
  open,
  onClose,
  selectedTask,
  setSelectedTask,
  getTasks,
  getTasksPages,
}) => {
  const user = JSON.parse(sessionStorage.getItem("userDetails"));

  const [inputs, setInputs] = useState({
    taskName: "",
    taskDescription: "",
    problemStatement: "",
    referenceCode: "",
  });

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedPriority, setSelectedPriority] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [assignedUsers, setAssignedUsers] = useState([]);

  const [products, setProducts] = useState([]);
  const { data: userDataa, isLoading: loadingUsers } = useGetUserAll();
  const userData = userDataa?.data || [];

  useEffect(() => {
    if (selectedTask) {
      setInputs({
        taskName: selectedTask.taskName || "",
        taskDescription: selectedTask.taskDescription || "",
        problemStatement: selectedTask.problemStatement || "",
        referenceCode: selectedTask.referenceCode || "",
      });
      setDueDate(
        selectedTask.dueDate
          ? new Date(selectedTask.dueDate).toISOString().slice(0, 16)
          : ""
      );
      setSelectedProduct(selectedTask.product || null);
      setSelectedPriority(selectedTask.priority || "");
      setAssignedUsers(selectedTask.assignedUsers || []);
    }
  }, [selectedTask]);

 

  
    useEffect(() => {
      const fetchProducts = async () => {
        try {
          const res = await getRequest("/product/getAllProductList");
  
          console.log("🧪 Full Product Response:", res);
  
          if (res && Array.isArray(res.data?.data)) {
            setProducts(res.data.data); // proper access
          } else if (Array.isArray(res.data)) {
            setProducts(res.data);
          } else {
            console.warn("⚠️ No valid product data found in response");
          }
        } catch (err) {
          console.error(" Product fetch failed:", err);
        }
      };
  
      fetchProducts();
    }, []);
  
  
  


  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTask) return;

    const request = {
      taskId: selectedTask.taskId,
      status: selectedTask.status,
      addedDateTime: selectedTask.addedDateTime,
      completedDateTime: selectedTask.completedDateTime,
      userId: user.id,
      ...inputs,
      product: selectedProduct ? { id: selectedProduct.id } : null,
      priority: selectedPriority || null,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
    };

    try {
      const { data } = await postRequest("/task/addTask", request);
      if (data) {
        const taskId = data?.data?.taskId;

        // Assign users if updated
        if (assignedUsers.length > 0) {
          const assignPayload = {
            taskId,
            userIds: assignedUsers.map((u) => u.id),
          };
          await postRequest("/task/assignTask", assignPayload);
        }

        showToast("Task updated successfully", ToastTypes.success);
        handleCancel(); // Reset and close modal
        getTasks();
        getTasksPages();
      } else {
        showToast(data.message || "Task update failed", ToastTypes.error);
      }
    } catch (error) {
      console.error("Task update error:", error);
      showToast("Something went wrong", ToastTypes.error);
    }
  };

  const handleCancel = () => {
    setInputs({
      taskName: "",
      taskDescription: "",
      problemStatement: "",
      referenceCode: "",
    });
    setSelectedProduct(null);
    setSelectedPriority("");
    setDueDate("");
    setAssignedUsers([]);
    setSelectedTask(undefined);
    onClose();
  };

  return (
    <Modal open={open} onClose={handleCancel}>
      <Box sx={modalStyle}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Edit Task</Typography>
          <IconButton onClick={handleCancel}>
            <CloseIcon />
          </IconButton>
        </Box>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
          <TextField
            label="Task Name"
            name="taskName"
            fullWidth
            rows={2}
            required
            value={inputs.taskName}
            onChange={handleChange}
            multiline
          />
          <TextField
            label="Task Description"
            name="taskDescription"
            fullWidth
            rows={2}
            value={inputs.taskDescription}
            onChange={handleChange}
            multiline
          />

          <div className="flex flex-col sm:flex-row gap-4">
            <TextField
              label="Product"
              select
              fullWidth
              size="small"
              value={selectedProduct?.id || ""}
              onChange={(e) =>
                setSelectedProduct(
                  products.find((p) => p.id === parseInt(e.target.value))
                )
              }
            >
              {products.map((product) => (
                <MenuItem key={product.id} value={product.id}>
                  {product.productName}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Priority"
              select
              fullWidth
              size="small"
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
            >
              <MenuItem value="P1">P1</MenuItem>
              <MenuItem value="P2">P2</MenuItem>
              <MenuItem value="P3">P3</MenuItem>
            </TextField>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <TextField
              label="Due Date"
              type="datetime-local"
              fullWidth
              size="small"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <Autocomplete
              multiple
              options={userData}
              fullWidth
              size="small"
              getOptionLabel={(user) => `${user.firstName} ${user.lastName}`}
              value={assignedUsers}
              onChange={(e, newValue) => setAssignedUsers(newValue)}
              loading={loadingUsers}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Assign Users"
                  fullWidth
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loadingUsers ? <CircularProgress size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          </div>

          <TextField
            label="Problem Statement"
            name="problemStatement"
            value={inputs.problemStatement}
            onChange={handleChange}
            fullWidth
            multiline
          />
          <TextField
            label="Reference Code"
            name="referenceCode"
            value={inputs.referenceCode}
            onChange={handleChange}
            fullWidth
            multiline
          />

          <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
            <Button variant="outlined" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Update
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default EditTaskModal;
