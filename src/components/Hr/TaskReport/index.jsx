import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  Typography,
  Button,
  Modal,
  Box,
  TablePagination,
  TextField,
  MenuItem,
  IconButton,
} from "@mui/material";
import { useGetUserAll } from "../AutoAttendance/hook";
import { getAllProductList, useGetAllTaskReport } from "./hook";
import * as XLSX from "xlsx";
import CloseIcon from '@mui/icons-material/Close'; 

const CummulativeReport = ({ darkMode }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openModal, setOpenModal] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const { data: userData } = useGetUserAll();
  const { data: products } = getAllProductList();

  const { data: reportData, isLoading } = useGetAllTaskReport(
    selectedProduct?.id,
    selectedUserId,
    selectedStatus,
    page + 1,
    rowsPerPage
  );

  const taskList = reportData?.content || [];
  const totalReports = reportData?.totalElements || 0;

  const handleOpenModal = (users) => {
    setSelectedUsers(users);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedUsers([]);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleReset = () => {
    setSelectedUserId("");
    setSelectedProduct(null);
    setSelectedStatus("");
    setPage(0);
    setRowsPerPage(10);
  };

  const handleExportToExcel = () => {
    // Prepare the data for export
    const exportData = taskList.map((task, index) => ({
      SrNo: page * rowsPerPage + index + 1,
      TaskName: task.taskName,
      TaskDescription: task.taskDescription,
      Status: task.status,
      AssignedUsers: task.assignedUsers
        .map((user) => `${user.firstName} ${user.lastName}`)
        .join(", "),
      ProductName: task?.product?.productName,
      DueDate: task.dueDate ? task.dueDate.substring(0, 10) : null,
      AddedDateTime: task.addedDateTime.substring(0, 10),
      CompletedDateTime: task.completedDateTime
        ? task.completedDateTime.substring(0, 10)
        : null,
      Difficulty: task.difficulty || "N/A",
      Priority: task.priority,
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);

    // Create a workbook from the worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Tasks");

    // Export the workbook as an Excel file
    XLSX.writeFile(wb, "Task_Report.xlsx");
  };

  return (
    <>
      {" "}
      <Box p={3}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
          Task Report
        </Typography>
        <Box
          display="flex"
          gap={2}
          flexWrap="wrap"
          alignItems="flex-end"
          sx={{ mb: 2, mt: 2 }}
        >
          <TextField
            select
            label="Select User"
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            sx={{ minWidth: 200 }}
            size="small"
          >
            <MenuItem value="">All Users</MenuItem>
            {userData?.data?.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                {user.firstName} {user.lastName}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Select Product"
            value={selectedProduct?.id || ""}
            onChange={(e) => {
              const prod = products.find(
                (p) => p.id === parseInt(e.target.value)
              );
              setSelectedProduct(prod);
            }}
            sx={{ minWidth: 200 }}
            size="small"
          >
            {products?.length > 0 ? (
              products.map((product) => (
                <MenuItem key={product.id} value={product.id}>
                  {product.productName}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>No Products Found</MenuItem>
            )}
          </TextField>
          <TextField
            select
            label="Select Status"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            sx={{ minWidth: 200 }}
            size="small"
          >
            <MenuItem value="">All Status</MenuItem>
            <MenuItem value="todo">To Do</MenuItem>
            <MenuItem value="inprogress">In Progress</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
          </TextField>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleReset}
            size="small"
            sx={{ mb: 0.5 }}
          >
            Reset Filters
          </Button>
          <Button
            variant="contained"
            color="success"
            size="small"
            onClick={handleExportToExcel}
            sx={{ mb: 0.5 }}
          >
            Export to Excel
          </Button>
        </Box>
        <Card className="p-2 mb-1 bg-gray-200 dark:bg-gray-800 text-black dark:text-white flex justify-between items-center rounded-md shadow-sm">
          <div className="w-[10%] font-semibold text-sm">Sr.No</div>
          <div className="w-[30%] font-semibold text-sm">Task Name</div>
          <div className="w-[25%] font-semibold text-sm">Assigned Users</div>
          <div className="w-[20%] font-semibold text-sm">Products</div>
          <div className="w-[20%] font-semibold text-sm">Added Date</div>
          <div className="w-[20%] font-semibold text-sm">Due Date</div>
          <div className="w-[15%] font-semibold text-sm">Status</div>
        </Card>
        <div className="my-2">
          {taskList
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((task, index) => (
              <Card
                key={index}
                className="p-2 min-h-10 bg-[#f5f5f5] dark:bg-gradient-to-r dark:from-[#000] dark:via-[#0f0f0f] dark:to-[#1f1f1f] mb-1 text-black dark:text-gray-100 flex justify-between items-center rounded-lg shadow-md"
              >
                <div className="w-[10%]">
                  <Typography variant="body2">
                    {page * rowsPerPage + index + 1}
                  </Typography>
                </div>
                <div className="w-[30%]">
                  <Typography fontWeight={500}>{task.taskName}</Typography>
                </div>
                <div className="w-[25%]">
                  {task.assignedUsers.length > 0 ? (
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleOpenModal(task.assignedUsers)}
                    >
                      View Assigned Users
                    </Button>
                  ) : (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      fontStyle="italic"
                    >
                      No users assigned
                    </Typography>
                  )}
                </div>
                <div className="w-[20%]">
                  <Typography variant="body2" color="text.secondary">
                    {task?.product?.productName}
                  </Typography>
                </div>
                <div className="w-[20%]">
                  <Typography variant="body2" color="inherit">
                    {task.addedDateTime.substring(0, 10)}
                  </Typography>
                </div>
                <div className="w-[20%]">
                  <Typography
                    variant="body2"
                    color={
                      task.dueDate &&
                      task.dueDate.substring(0, 10) <
                        new Date().toISOString().substring(0, 10)
                        ? "red"
                        : "inherit"
                    }
                  >
                    {task.dueDate
                      ? task.dueDate.substring(0, 10)
                      : "No Due Date"}
                  </Typography>
                </div>
                <div className="w-[15%]">
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 500,
                      textTransform: "capitalize",
                      color:
                        task.status === "Completed"
                          ? "green"
                          : task.status === "In Progress"
                          ? "orange"
                          : "gray",
                    }}
                  >
                    {task.status}
                  </Typography>
                </div>
              </Card>
            ))}
        </div>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalReports}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />

        {/* Modal to show assigned users */}
        <Modal open={openModal} onClose={handleCloseModal}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: darkMode ? "#1e1e1e" : "#ffffff",
              color: darkMode ? "#f5f5f5" : "#000000",
              boxShadow: 24,
              p: 3,
              borderRadius: 2,
              width: 400,
            }}
          >
              <IconButton
          onClick={handleCloseModal}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            color: darkMode ? '#f5f5f5' : '#000000',
          }}
        >
          <CloseIcon/>
        </IconButton>
            <Typography variant="h6" mb={2}>
              Assigned Users
            </Typography>
            {selectedUsers.map((user, i) => (
              <Typography key={i} variant="body2" mb={1}>
                {user.firstName} {user.lastName}
              </Typography>
            ))}
            {selectedUsers.length === 0 && (
              <Typography variant="body2" color="text.secondary">
                No users assigned
              </Typography>
            )}
          </Box>
        </Modal>
      </Box>
    </>
  );
};

export default CummulativeReport;
