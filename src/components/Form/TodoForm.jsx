import React, { useEffect, useState } from "react";
import {
  TextField,
  MenuItem,
  Autocomplete,
} from "@mui/material";
import Button from "../Button/Button";
import { postRequest, getRequest } from "../../utils/apiClient";
import { showToast, ToastTypes } from "../toast";
import { useGetUserAll } from "../Hr/AutoAttendance/hook";

const TodoForm = ({
  selectedTask,
  setSelectedTask,
  getTasks,
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const request = {
      ...(selectedTask
        ? {
            taskId: selectedTask.taskId,
            status: selectedTask.status,
            addedDateTime: selectedTask.addedDateTime,
            completedDateTime: selectedTask.completedDateTime,
            userId: user.id,
          }
        : {
            status: "todo",
            userId: user.id,
          }),
      ...inputs,
      product: selectedProduct ? { id: selectedProduct.id } : null,
      priority: selectedPriority || null,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
    };

    try {
      const { data } = await postRequest("/task/addTask", request);

      if (data) {
        const taskId = data?.data?.taskId;

        showToast("Task created successfully", ToastTypes.success);

        if (assignedUsers.length > 0) {
          const assignPayload = {
            taskId,
            userIds: assignedUsers.map((u) => u.id),
          };
          const assignRes = await postRequest("/task/assignTask", assignPayload);

          // if (assignRes) {
          //   showToast("Users assigned successfully", ToastTypes.success);
          // } else {
          //   showToast("Failed to assign users", ToastTypes.warning);
          // }
        }

        // Reset form
        setInputs({
          taskName: "",
          taskDescription: "",
          problemStatement: "",
          referenceCode: "",
        });
        setSelectedTask(undefined);
        setSelectedPriority("");
        setSelectedProduct(null);
        setDueDate("");
        setAssignedUsers([]);
        getTasks();
      } else {
        showToast(data.message || "Task creation failed", ToastTypes.error);
      }
    } catch (error) {
      console.error("❌ Error in task submission:", error);
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
    setSelectedTask(undefined);
    setSelectedPriority("");
    setSelectedProduct(null);
    setDueDate("");
    setAssignedUsers([]);
  };

  useEffect(() => {
    if (selectedTask) {
      setInputs({
        taskName: selectedTask.taskName,
        taskDescription: selectedTask.taskDescription,
        problemStatement: selectedTask.problemStatement || "",
        referenceCode: selectedTask.referenceCode || "",
      });
      setDueDate(
        selectedTask.dueDate
          ? new Date(selectedTask.dueDate).toISOString().slice(0, 16)
          : ""
      );
    }
  }, [selectedTask]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getRequest("/product/getAllProductList");
        const productList = Array.isArray(res.data?.data)
          ? res.data.data
          : Array.isArray(res.data)
          ? res.data
          : [];
        setProducts(productList);
      } catch (err) {
        console.error("Product fetch failed:", err);
      }
    };

    fetchProducts();
  }, []);

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 p-4 rounded-md shadow-md w-full max-w-4xl bg-white dark:bg-black"
    >
      {/* Task Name & Description */}
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

      {/* Product & Priority */}
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
      {/* Due Date */}
      <TextField
        label="Due Date"
        type="datetime-local"
        fullWidth
             size="small"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        InputLabelProps={{ shrink: true }}
      />

      {/* Assigned Users */}
      <Autocomplete
        multiple
        id="assign-users"
        options={userData}
             fullWidth
             size="small"
        getOptionLabel={(user) => `${user.firstName} ${user.lastName}`}
        value={assignedUsers}
        onChange={(e, newValue) => setAssignedUsers(newValue)}
        loading={loadingUsers}
        renderInput={(params) => (
          <TextField {...params} label="Assign Users" fullWidth />
        )}
      />
</div>
      {/* Problem Statement & Reference Code - Only while editing */}
      {selectedTask && (
        <>
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
        </>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4">
          <Button
          type="submit"
          variant="dark"
          size="small"
          className="h-[56px] w-full sm:mt-0 mt-2 self-stretch sm:self-start bg-blue-600 text-white border border-blue-700 hover:bg-blue-700 dark:bg-blue-800 dark:border-blue-700 dark:hover:bg-blue-700"
        >
          {selectedTask ? "Update" : "Add"} Task
        </Button>
        {selectedTask && (
          <Button type="button" variant="light" onClick={handleCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};

export default TodoForm;
