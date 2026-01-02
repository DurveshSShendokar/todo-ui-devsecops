import React from "react";
import PreviewIcon from "@mui/icons-material/Preview";
import BasicAccordion from "./BasicAccordition";
import Menu from "./Menu";
import DeleteIcon from "@mui/icons-material/Delete";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import Card from "./Card/Card";
import Tooltip from "@mui/material/Tooltip";
import Pagination from "@mui/material/Pagination";

const TodoDashboard = ({
  tasks,
  setCurrentTaskView,
  setModalOpen,
  setSelectedTask,
  setSelectedId,
  setDeleteDialogOpen,
  currentPage,
  handleStatusChange,
  totalPages,
  handlePageChange,
  ...props
}) => {
  const handleEdit = (task) => {
    setSelectedTask(task);
  };

  return (
    <BasicAccordion {...props} className="my-2">
      {tasks?.map((task, index) => {
        return (
          <Card
            className="p-1 min-h-10 bg-[#f5f5f5] dark:bg-gradient-to-r dark:from-[#1f1f1f] dark:via-[#292929] dark:to-[#1f1f1f] mb-1 text-black dark:text-gray-100 flex justify-between items-center rounded-lg shadow-lg"
            key={index}
          >
            <div className="w-[35%] flex items-center">
              <Menu
                task={task}
                currentStatus={task.status}
                onStatusChange={handleStatusChange}
              />
              <span className="ml-2">{task.taskName}</span>
            </div>
            <div
              className={`${
                task.addedDateTime.substring(0, 10) <
                  new Date().toISOString().substring(0, 10) &&
                task.status !== "completed"
                  ? "text-red-800 dark:text-red-400"
                  : ""
              } text-center`}
            >
              {task.addedDateTime.substring(0, 10)}
            </div>

            <div>
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
        );
      })}
      <div className="flex justify-center mt-2">
        <Pagination
          count={totalPages}
          color="primary"
          page={currentPage}
          onChange={handlePageChange}
          className="dark:text-gray-100 dark:bg-[#1f1f1f] dark:border dark:border-gray-600 rounded-lg shadow-lg"
        />
      </div>
    </BasicAccordion>
  );
};

export default TodoDashboard;
