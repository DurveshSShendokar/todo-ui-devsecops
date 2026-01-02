import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardContent,
  Typography,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  Grid,
  Box,
  Divider,
  useTheme,
  TablePagination,
  IconButton,
} from "@mui/material";
import { format } from "date-fns";
import { AccessTime, CheckCircle, Cancel, Edit } from "@mui/icons-material";
import toast from "react-hot-toast";

// Custom Hooks
import {
  useCreateLeaveRequest,
  useGetAllLeaveRequestByUser,
  useGetBalancedLeaveByUser,
  useGetSummaryByUser,
  useUpdateLeaveRequest,
} from "./hook";

const UserLeaveDashboard = ({ darkMode }) => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [leaveReason, setLeaveReason] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [userId, setUserId] = useState(null);
  const [editId, setEditId] = useState(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
    if (userDetails) setUserId(userDetails?.id?.toString() || null);
  }, []);

  const { data, refetch } = useGetAllLeaveRequestByUser(userId);
  const tableData = data?.data || [];
  const { data: balancedLeaveCount } = useGetBalancedLeaveByUser(userId);
  const { data: getSummary } = useGetSummaryByUser(userId);
  const getSummaryData = getSummary?.data || {};
const totalPaid = Number(getSummaryData.totalPaidLeaves) || 0;
const totalUnpaid = Number(getSummaryData.totalUnpaidLeaves) || 0;

const totalLeaves = totalPaid + totalUnpaid;
  const { mutate: CreateLeaveRequest } = useCreateLeaveRequest();
  const { mutate: UpdateLeaveRequest } = useUpdateLeaveRequest();

  const handleApply = () => {
    if (!fromDate || !toDate) return;

    const payload = {
      startDate: fromDate,
      endDate: toDate,
      reason: leaveReason,
    };

    const onSuccess = () => {
      toast.success(editId ? "Leave updated" : "Leave applied");
      setOpen(false);
      setFromDate("");
      setToDate("");
      setLeaveReason("");
      setEditId(null);
      refetch();
    };

    if (editId) {
      UpdateLeaveRequest({ id: editId, updateEntry: payload }, { onSuccess });
    } else {
      CreateLeaveRequest({ userId, newEntry: payload }, { onSuccess });
    }
  };

  const handleEdit = (row) => {
    setFromDate(row.startDate);
    setToDate(row.endDate);
    setLeaveReason(row.reason);
    setEditId(row.id);
    setOpen(true);
  };

  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value));
    setPage(0);
  };

  const paginatedData = tableData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "APPROVED":
        return "success";
      case "PENDING":
        return "warning";
      case "REJECTED":
        return "error";
      default:
        return "default";
    }
  };


  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" align="center" fontWeight="bold" gutterBottom>
        User Leave Dashboard
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} mt={2}>
        <Grid item xs={12} sm={4}>
          <Card
            sx={{
              background: "linear-gradient(to right, #a8edea, #fed6e3)",
              borderLeft: `5px solid ${theme.palette.primary.main}`,
              color: theme.palette.mode === "dark" ? "#000" : "#333",
              boxShadow: 3,
            }}
          >
            <CardContent>
              <Typography variant="subtitle1">Total Balance Leaves</Typography>
              <Typography variant="h4" fontWeight="bold">
              {typeof balancedLeaveCount?.data === "number" ? balancedLeaveCount.data : 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card
            sx={{
              background: "linear-gradient(to right, #89f7fe, #66a6ff)",
              borderLeft: `5px solid ${theme.palette.primary.main}`,
              color: theme.palette.mode === "dark" ? "#000" : "#333",
              boxShadow: 3,
            }}
          >
            <CardContent>
              <Typography variant="subtitle1">Total Leaves Taken</Typography>
              <Typography variant="h4" fontWeight="bold">
                {totalLeaves}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card
            sx={{
              background: "linear-gradient(to right, #fddb92, #d1fdff)",
              borderLeft: `5px solid ${theme.palette.primary.main}`,
              color: theme.palette.mode === "dark" ? "#000" : "#333",
              boxShadow: 3,
            }}
          >
            <CardContent>
              <Typography variant="subtitle1">Total paid Leaves</Typography>
              <Typography variant="h4" fontWeight="bold">
                  { getSummaryData && getSummaryData?.totalPaidLeaves || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      {/* Apply Button */}
      <Box display="flex" justifyContent="flex-end" mt={3} mb={2}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => {
            setOpen(true);
            setEditId(null);
            setFromDate("");
            setToDate("");
            setLeaveReason("");
          }}
          sx={{
            borderRadius: "30px",
            textTransform: "none",
            fontWeight: "bold",
          }}
        >
          Apply for Leave
        </Button>
      </Box>

      {/* Leave History Table */}
      <Card sx={{ boxShadow: 4 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Leave History
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Sr No.</TableCell>
                <TableCell>📅 From Date</TableCell>
                <TableCell>📅 To Date</TableCell>
                <TableCell>📌 Reason</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.map((leave, index) => (
                <TableRow key={leave.id || index}>
                  <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell>
                    {format(new Date(leave.startDate), "yyyy-MM-dd")}
                  </TableCell>
                  <TableCell>
                    {format(new Date(leave.endDate), "yyyy-MM-dd")}
                  </TableCell>
                  {/* <TableCell>{leave.reason}</TableCell> */}
                  <TableCell>
                    {" "}
                    <Chip
                      label={leave.reason}
                      variant="outlined"
                      color="success"
                    />
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={leave.status}
                      color={getStatusColor(leave.status)}
                      icon={
                        leave.status === "APPROVED" ? (
                          <CheckCircle fontSize="small" />
                        ) : leave.status === "REJECTED" ? (
                          <Cancel fontSize="small" />
                        ) : (
                          <AccessTime fontSize="small" />
                        )
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => handleEdit(leave)}
                      color="primary"
                    >
                      <Edit />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <TablePagination
            component="div"
            count={tableData.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </CardContent>
      </Card>

      {/* Dialog for Apply/Edit */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle
          sx={{
            bgcolor: darkMode ? "#222" : "#d1fdff",
            color: darkMode ? "#fff" : "#000",
          }}
        >
          {editId ? "Edit Leave Request" : "Apply for Leave"}
        </DialogTitle>

        <DialogContent>
          <Grid container spacing={2} mt={1}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="From Date"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="To Date"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Reason"
                placeholder="Enter reason for leave..."
                multiline
                minRows={2}
                fullWidth
                value={leaveReason}
                onChange={(e) => setLeaveReason(e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleApply}>
            {editId ? "Update" : "Apply"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserLeaveDashboard;
