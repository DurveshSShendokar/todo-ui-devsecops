import React, { useState } from "react";
import PreviewIcon from "@mui/icons-material/Preview";
import BasicAccordion from "../BasicAccordition";
import Menu from "../Menu";
import DeleteIcon from "@mui/icons-material/Delete";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import Card from "../Card/Card";
import Tooltip from "@mui/material/Tooltip";
import Pagination from "@mui/material/Pagination";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import {
  Avatar,
  AvatarGroup,
  Typography,
  Popover,
  IconButton,
  TablePagination,
} from "@mui/material";
import {
  deepPurple,
  green,
  pink,
  orange,
  teal,
  blueGrey,
} from "@mui/material/colors";
import CloseIcon from "@mui/icons-material/Close";
import { fetchData } from "../../utils/apiClient";
import { showToast, ToastTypes } from "../toast";
import EditTaskModal from "./editModal";

const avatarColors = [
  deepPurple[500],
  green[500],
  pink[500],
  orange[500],
  teal[500],
  blueGrey[500],
];

const TaskListContainer = ({
  tasks,
  setCurrentTaskView,
  setModalOpen,
  setAssignTask,
  setAssignModalOpen,
  setSelectedId,
  setDeleteDialogOpen,
  currentPage,
  handleStatusChange,
  totalPages,
  handlepagechange,
  totalTasks,
   rowsPerPage,
  handleChangeRowsPerPage,
  refreshTasks, 
  ...props
}) => {

const [editModalOpen, setEditModalOpen] = useState(false);
const [selectedTask, setSelectedTask] = useState();
const handleEdit = (task) => {
  setSelectedTask(task);
  setEditModalOpen(true);
};


console.log("checktaskdata",tasks);

  const unassignUserFromTask = async (taskId, userId) => {
    try {
      const response = await fetchData("/task/unassignTask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId, userIds: [userId] }),
      });

      const data = response || response;

      if (data) {
        console.log("User unassigned successfully");
        showToast(
          data.message || "User Removed From Task successfully",
          ToastTypes.success
        );
        refreshTasks();
      } else {
        console.error(
          "Failed to unassign user:",
          data?.message || "Unknown error"
        );
      }
    } catch (error) {
      console.error("Unassign error:", error);
    }
  };

  // AssignedUsers component inside TaskListContainer
  const AssignedUsers = ({ task }) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleOpen = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

    const open = Boolean(anchorEl);



    return (
      <>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          {task.assignedUsers.slice(0, 2).map((user, index) => (
            <Typography
              key={user.id}
              variant="body2"
              sx={{
                backgroundColor: avatarColors[index % avatarColors.length],
                color: "#fff",
                borderRadius: "12px",
                padding: "0px 4px",
                fontSize: "0.8rem",
                fontWeight: 500,
              }}
            >
              {user.firstName} {user.lastName}
              <IconButton
                onClick={() => unassignUserFromTask(task.taskId, user.id)}
                size="small"
                sx={{ ml: 0.2, p: 0.5, color: "#fff" }} // smaller padding
              >
                <CloseIcon sx={{ fontSize: 14 }} /> {/* custom font size */}
              </IconButton>
            </Typography>
          ))}
          {task.assignedUsers.length > 2 && (
            <Typography
              onClick={handleOpen}
              sx={{
                cursor: "pointer",
                backgroundColor: "#ccc",
                borderRadius: "12px",
                padding: "4px 10px",
                fontSize: "0.8rem",
                fontWeight: 500,
                color: "#000",
              }}
            >
              ...more
            </Typography>
          )}
        </div>

        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        >
          <div style={{ padding: 12, maxWidth: 250 }}>
            <Typography fontWeight="bold" mb={1}>
              Assigned Users
            </Typography>
            {task.assignedUsers.map((user) => (
              <div
                key={user.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <Typography variant="body2">
                  {user.firstName} {user.lastName}
                </Typography>
                <Tooltip title="Unassign">
                  <IconButton
                    size="small"
                    onClick={() => unassignUserFromTask(task.taskId, user.id)}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </div>
            ))}
          </div>
        </Popover>
      </>
    );
  };



  return (
    <BasicAccordion {...props} className="my-2">
{tasks?.map((task, index) => (

       <Card
  className="p-3 min-h-10 bg-[#f5f5f5] dark:bg-gradient-to-r dark:from-[#000] dark:via-[#0f0f0f] dark:to-[#1f1f1f] mb-2 text-black dark:text-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center rounded-lg shadow-lg gap-4"
  key={index}
>

       <div className="w-full md:w-[35%] flex items-center">
            <Tooltip title="Change Status" arrow>
              <div style={{ cursor: "pointer" }}>
                <Menu
                  task={task}
                  currentStatus={task.status}
                  onStatusChange={handleStatusChange}
                />
              </div>
            </Tooltip>
            <span className="ml-2">{task.taskName}</span>
          </div>

          {task.assignedUsers && task.assignedUsers.length > 0 ? (
            <div style={{ marginLeft: 16, marginTop: 8 }}>
              <AssignedUsers task={task} />
            </div>
          ) : (
            <Typography
              variant="body2"
              sx={{
                marginLeft: 2,
                marginTop: 1,
                color: "text.secondary",
                fontStyle: "italic",
              }}
            >
              No users assigned
            </Typography>
          )}

        

          <div className="flex gap-2">
              <div
            className={`${
              task.addedDateTime.substring(0, 10) <
                new Date().toISOString().substring(0, 10) &&
              task.status !== "completed"
                ? "text-red-800 dark:text-red-400"
                : ""
            } text-center ml-6`}
          >
 {task.dueDate ? task.dueDate.slice(0, 10) : ""}


          </div>

            <Tooltip title="Assign Task">
              <GroupAddIcon
                className="mx-3 cursor-pointer hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-300"
                onClick={() => {
                  setAssignTask(task);
                  setAssignModalOpen(true);
                }}
              />
            </Tooltip>
            <Tooltip title="View">
              <PreviewIcon
                className="mx-3 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
                onClick={() => {
                  setCurrentTaskView(task);
                  setModalOpen(true);
                }}
              />
            </Tooltip>

            <Tooltip title="Edit">
              <BorderColorOutlinedIcon
                className="mx-3 cursor-pointer hover:text-green-600 dark:hover:text-green-400 transition-colors duration-300"
                onClick={() => handleEdit(task)}
              />
            </Tooltip>

            <Tooltip title="Delete">
              <DeleteIcon
                className="mx-3 cursor-pointer text-red-800 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors duration-300"
                onClick={() => {
                  setSelectedId(task.taskId);
                  setDeleteDialogOpen(true);
                }}
              />
            </Tooltip>
          </div>
        </Card>
      ))}

      <div className="flex justify-center mt-2">
   <TablePagination
  component="div"
  count={totalTasks}
  page={currentPage-1}
  onPageChange={handlepagechange}
  rowsPerPage={rowsPerPage}
  onRowsPerPageChange={handleChangeRowsPerPage}
  rowsPerPageOptions={[5, 10, 25]}
/>

<EditTaskModal
  open={editModalOpen}
  onClose={() => setEditModalOpen(false)}
  selectedTask={selectedTask}
  setSelectedTask={setSelectedTask}
  getTasks={refreshTasks}
  getTasksPages={refreshTasks}
/>



      </div>
    </BasicAccordion>
  );
};

export default TaskListContainer;
