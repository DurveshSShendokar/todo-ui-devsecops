import React, { useEffect, useState } from "react";
import Card from "../Card/Card";
import Dialog from "../Dialog";
import {
  Badge,
  IconButton,
  Popover,
  Typography,
  Box,
  TextField,
  MenuItem,
  Tooltip,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import BasicModal from "../BasicModal";
import { ToastTypes, showToast } from "../toast";
import TodoForm from "../Form/TodoForm";
import TaskListContainer from "./TaskListContainer";
import FormInput from "../Input/FormInput";
import SearchIcon from "@mui/icons-material/Search";
import TaskChart from "../Charts/TaskChart";
import Dropdown from "../Dropdown/Dropdown";
import { getRequest, postRequest } from "../../utils/apiClient";
import AssignModal from "../AssignModal";
import Button from "../Button/Button";
import { useNavigate } from "react-router-dom";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { usePreviousPath } from "../../Context/BreadCrumbContext";
import { useGetUserAll } from "../Hr/AutoAttendance/hook";
import { usePermissions } from "../../Context/permissionContext";

const TodoList = ({ className = "" }) => {
  const [tasks, setTasks] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [assignTask, setAssignTask] = useState(null);
  const [selectedTask, setSelectedTask] = useState();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState();
  const [todoPages, setTodoPages] = useState(1);
  const [todoCurrentPage, setTodoCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalElement, settotalElement] = useState();
  const [ModalOpen, setModalOpen] = useState(false);
  const handleClose = () => setModalOpen(false);

  const [currentTaskView, setCurrentTaskView] = useState(null);
  const [text, setText] = useState("");
  const [todaysData, setTodaysData] = useState([]);
  const [totalData, setTotalData] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedPriority, setSelectedPriority] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [products, setProducts] = useState([]);
  const [roleNameUser, setRoleNameUser] = useState([]);

  const navigate = useNavigate();
  const userDetails = sessionStorage.getItem("userDetails");
  const user = JSON.parse(userDetails);

  const pageSize = 10;

  const [dropdowStatus, setDropdownStatus] = useState("todo");

  const { routes } = usePermissions();
  console.log("routes", routes);

  const dashboardPermission = routes?.dashboardPermission || [];

  const DashboardPermission = dashboardPermission.find(
    (permission) => permission.permissionsName === "Todo Dashboard"
  );

  const dashboardActions =
    DashboardPermission?.actions
      ?.filter((action) => action.selected)
      .map((action) => action.actionName) || [];

  const canManagement = dashboardActions.includes("Management");

  console.log("canManagement", canManagement);

  const handleDropdownChange = (event) => {
    setDropdownStatus(event.target.value);
    setTodoCurrentPage(1);
  };
  const { data } = useGetUserAll();
  const userData = data?.data || [];


const getTasks = async () => {
  const userDetails = JSON.parse(
    sessionStorage.getItem("userDetails") || "{}"
  );
  const userId = userDetails?.id;
  const role = userDetails?.role?.roleName;
  setRoleNameUser(role);

  const queryParams = new URLSearchParams({
    pageNo: todoCurrentPage.toString(),
    perPage: rowsPerPage.toString(),
    status: dropdowStatus,
  });

  if (canManagement && selectedUserId) {
    queryParams.append("userId", selectedUserId.toString());
  }
  if (selectedProduct?.id) {
    queryParams.append("productId", selectedProduct.id.toString());
  }
  if (selectedPriority) {
    queryParams.append("priority", selectedPriority);
  }
  if (text) {
    queryParams.append("searchText", text);
  }

  try {
    let endpoint = "";

    if (canManagement && selectedUserId) {
      endpoint = `/task/getAssignedTaskListForUser?${queryParams.toString()}`;
    } else if (canManagement) {
      endpoint = `/task/getTaskByUserWithSearchAndPagination?${queryParams.toString()}`;
    } else {
      endpoint = `/task/getTaskByUserWithSearchAndPagination?userId=${userId}&&${queryParams.toString()}`;
    }

    const res = await getRequest(endpoint);
    if (res) {
      setTasks(res.data?.data?.content);
      setTodoPages(res.data?.data?.totalPages);
      settotalElement(res.data?.data?.totalElements);
    }
  } catch (err) {
    console.error("❌ Error loading tasks", err);
  }
};


 
  const fetchAssignedTasks = async () => {
    const userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
    if (!userDetails) return;

    try {
      const { data } = await getRequest(
        `/task/getAssignedTasksForUser/${userDetails.id}`
      );
      if (data) {
        setAssignedTasks(data.data);
      }
    } catch (err) {
      console.error("❌ Error fetching assigned tasks", err);
    }
  };

  useEffect(() => {
    getTasks();
    fetchAssignedTasks();
  }, [
    dropdowStatus,
    todoCurrentPage,
    selectedProduct,
    selectedPriority,
    pageSize,
    todoCurrentPage,
    rowsPerPage,
    selectedUserId,
    text,
  ]);

  //todays graph data is here
  const getTodaysTask = async () => {
    const endpoint = `task/getTodayTaskByUser/${user.id}`;
    const { data } = await getRequest(endpoint);
    if (data) {
      setTodaysData(data?.data);
    }
  };

  //total graph data is here
  const getTotalTask = async () => {
    const endpoint = `task/getAllTaskByUser/${user.id}`;
    const { data } = await getRequest(endpoint);
    if (data) {
      setTotalData(data.data);
    }
  };

  useEffect(() => {
    getTodaysTask();
    getTotalTask();
  }, []);

  //delete task hook
  const handleDelete = async (id) => {
    const endpoint = `/task/deleteTask/${id}`;
    const { data } = await getRequest(endpoint);
    if (data) {
      showToast(data.message, ToastTypes.success);
      getTasks();
    } else showToast(data.message, ToastTypes.error);
  };

  //update task
  const handleStatusChange = async (task, status) => {
    const endpoint = "/task/updateStatus";
    const request = {
      ...task,
      status: status,
    };
    const { data } = await postRequest(endpoint, request);
    console.log("staus", data);
    if (data) {
      showToast(data.message, ToastTypes.success);
      getTasks();
    } else {
      showToast(data.message, ToastTypes.error);
    }
  };
  const handleChangePage = (event, newPage) => {
    console.log("handlePageChange", newPage);

    setTodoCurrentPage(newPage + 1);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setTodoCurrentPage(1);
  };

  const handleSearchChange = (event) => {
    setText(event.target.value);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getRequest("/product/getAllProductList");

        console.log("🧪 Full Product Response:", res);

        if (res && Array.isArray(res.data?.data)) {
          setProducts(res.data.data);
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

  const today = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const { setPreviousPath } = usePreviousPath();

  const handleNavigation = () => {
    setPreviousPath(window.location.pathname);
    navigate("/Hr/attendance");
  };

  return (
    <Card className={`bg-[#F0F0F0] dark:bg-[#202020] ${className} mt-2`}>
      <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-center gap-2 sm:gap-0 mb-5 py-6 px-4 sm:px-6 bg-gradient-to-r from-blue-700 to-pink-600 rounded-lg shadow-lg">
        <h1 className="text-center text-4xl font-bold text-white">
          What’s your plan for today?
          <span className="block text-lg font-medium bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
            <span className="text-white shadow-lg">{today}</span>
          </span>
        </h1>
        <div className="absolute right-4 top-4">
          <IconButton
            color="inherit"
            onClick={(e) => setAnchorEl(e.currentTarget)}
          >
            <Badge badgeContent={assignedTasks.length} color="error">
              <NotificationsIcon sx={{ color: "#fff" }} />
            </Badge>
          </IconButton>
        </div>

        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Box sx={{ p: 2, width: 300 }}>
            <Typography variant="h6">Assigned Tasks</Typography>
            {assignedTasks.length === 0 ? (
              <Typography variant="body2">No new tasks assigned.</Typography>
            ) : (
              assignedTasks.map((task) => (
                <Box key={task.taskId} className="mt-2 p-2 border rounded">
                  <Typography fontWeight={600}>{task.taskName}</Typography>
                  <Typography variant="caption">
                    Status: {task.status}
                  </Typography>
                </Box>
              ))
            )}
          </Box>
        </Popover>
      </div>
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-4 mb-4">
        <p></p>
        <p></p>
        <h1 className="flex mr-12 justify-between font-bold text-2xl mb-2 text-transparent bg-clip-text bg-gradient-to-br from-blue-700 to-pink-600 ">
          Task Review
        </h1>

        <Tooltip title="Go to Attendance" arrow>
          <button
            onClick={handleNavigation}
            className="flex items-center gap-2 px-4 py-2 
               bg-white text-gray-800 
               dark:bg-white/10 dark:text-white 
               rounded-md 
               hover:bg-white/50 dark:hover:bg-white/20 
               transition duration-300 border dark:border-none"
          >
            <AccessTimeIcon className="text-inherit" />
            <span className="font-medium">Give Attendance</span>
          </button>
        </Tooltip>
      </div>
      <div className="flex flex-col lg:flex-row gap-4 mb-8">
        <div className="lg:w-1/2 flex-1">
          <TodoForm
            selectedTask={selectedTask}
            setSelectedTask={setSelectedTask}
            // getTasksPages={getTaskPages}
            getTasks={getTasks}
          />
        </div>

        <div className="lg:w-1/2 flex-1 ">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* {todaysData.length !== 0 && ( */}
            <div className="card bg-white dark:bg-black flex flex-col justify-center p-4 md:h-[316px]">
              <div className="flex items-center justify-center w-full mb-4">
                <h3 className="text-xl font-semibold text-center text-gray-800 dark:text-white">
                  Today's Chart
                </h3>
              </div>
              <TaskChart todaysData={todaysData} centerLabel="Today's : " />
            </div>
            {/* // )} */}

            <div className="card bg-white flex flex-col justify-center dark:bg-black p-4 mt-4 lg:mt-0">
              <div className="flex items-center justify-center w-full mb-4">
                <h3 className="text-xl font-semibold text-center text-gray-800 dark:text-white">
                  Total Tasks
                </h3>
              </div>
              <TaskChart todaysData={totalData} centerLabel="Total : " />
            </div>
          </div>
        </div>
      </div>

      {assignTask && (
        <AssignModal
          open={assignModalOpen}
          handleClose={() => setAssignModalOpen(false)}
          task={assignTask}
          refreshTasks={() => {
            getTasks();
          }}
        />
      )}

      <div className="flex flex-col md:flex-row flex-wrap gap-4 my-5">
        <div className="flex-1 min-w-[250px]">
          <Dropdown
            status={dropdowStatus}
            handleChange={handleDropdownChange}
          />
        </div>
        {/* User Select */}

        {canManagement && (
          <div className="flex-1 min-w-[200px] mt-2">
            {" "}
            <TextField
              select
              label="Select User"
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              sx={{ minWidth: 200 }}
              size="small"
            >
              <MenuItem value="">All Users</MenuItem>
              {userData.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.firstName} {user.lastName}
                </MenuItem>
              ))}
            </TextField>
          </div>
        )}

        {/* Product Select */}
        <div className="flex-1 min-w-[200px] mt-2">
          <TextField
            select
            fullWidth
            label="Select Product"
            value={selectedProduct?.id || ""}
            onChange={(e) => {
              const prod = products.find(
                (p) => p.id === parseInt(e.target.value)
              );
              setSelectedProduct(prod);
            }}
            size="small"
          >
            {products.length > 0 ? (
              products.map((product) => (
                <MenuItem key={product.id} value={product.id}>
                  {product.productName}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>No Products Found</MenuItem>
            )}
          </TextField>
        </div>

        {/* Priority Select */}
        <div className="flex-1 min-w-[150px] mt-2">
          <TextField
            select
            fullWidth
            label="Select Priority"
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            size="small"
          >
            <MenuItem value="P1">P1</MenuItem>
            <MenuItem value="P2">P2</MenuItem>
            <MenuItem value="P3">P3</MenuItem>
          </TextField>
        </div>

        {/* Search Input */}
        <div className="flex-1 min-w-[250px] mt-2">
          <FormInput
            htmlFor="search"
            name="searchBox"
            type="text"
            inputIcon={<SearchIcon />}
            placeholder="Search task"
            value={text}
            onChange={handleSearchChange}
          />
        </div>
        <div className="flex-1 min-w-[150px] mt-2">
          <Button
            variant="primary"
            color="secondary"
            fullWidth
            onClick={() => {
              setSelectedProduct(null);
              setSelectedPriority("");
              setText("");
              getTasks();
              setSelectedUserId("");
            }}
          >
            Reset Filters
          </Button>
        </div>
      </div>

      {tasks && (
        <TaskListContainer
          defaultExpanded
          heading={`${
            dropdowStatus === "todo"
              ? "To Do Tasks"
              : dropdowStatus === "inprogress"
              ? "In Progress Tasks"
              : "Completed Tasks"
          }`}
          headingStyle="text-blue-800 dark:text-blue-400"
          tasks={tasks}
          setCurrentTaskView={setCurrentTaskView}
          selectedTask={selectedTask}
          setModalOpen={setModalOpen}
          refreshTasks={() => {
            getTasks();
          }}
          setSelectedTask={setSelectedTask}
          setAssignTask={setAssignTask}
          setAssignModalOpen={setAssignModalOpen}
          setSelectedId={setSelectedId}
          setDeleteDialogOpen={setDeleteDialogOpen}
          currentPage={todoCurrentPage}
          totalPages={todoPages}
          totalTasks={totalElement}
          rowsPerPage={rowsPerPage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
          handlepagechange={handleChangePage}
          handleStatusChange={handleStatusChange}
        />
      )}

      <Dialog
        open={deleteDialogOpen}
        setOpen={setDeleteDialogOpen}
        handleDelete={() => handleDelete(selectedId)}
      />
      <BasicModal
        open={ModalOpen}
        handleClose={handleClose}
        items={currentTaskView}
      />
    </Card>
  );
};

export default TodoList;
