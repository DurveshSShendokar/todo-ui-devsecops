import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  MenuItem,
  TextField,
  Button,
  TablePagination,
} from "@mui/material";
import { useGetAllAttendanceReport, useGetAllAttendanceReportForExport } from "./hook";
import { useGetUserAll } from "../AdminAttendance/hook";
import dayjs from "dayjs";
import * as XLSX from "xlsx";

const AttendanceReport = () => {
  const { data } = useGetUserAll();
  const userData = data?.data || [];

  const defaultStartDate = dayjs().startOf("month").format("YYYY-MM-DD");
  const defaultEndDate = dayjs().format("YYYY-MM-DD");

  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { data: reportData, isLoading } = useGetAllAttendanceReport(
    startDate,
    endDate,
    selectedUserId,
    page + 1,
    rowsPerPage
  );

    const { data: exportsData } = useGetAllAttendanceReportForExport(startDate,
    endDate,)

  const reportList = reportData?.content || [];
  const totalReports = reportData?.totalElements || 0;

  const handleReset = () => {
    setStartDate(defaultStartDate);
    setEndDate(defaultEndDate);
    setSelectedUserId("");
    setPage(0);
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Export to Excel
  const handleExportToExcel = () => {
    if (reportList.length === 0) {
      alert("No data to export.");
      return;
    }

    const exportData = exportsData.map((entry, index) => ({
      "Sr No":  index + 1,
      "User Name": entry.user
        ? `${entry.user.firstName} ${entry.user.lastName}`
        : "N/A",
      "Total Days": entry.totalDays,
      "Present Days": entry.presentDays,
      "Absent Days": entry.absentDays,
      "Half Days": entry.halfDays,
      "Week Offs": entry.weekOffs,
      "Holidays": entry.holidays,
      "Total Working Days": entry.totalWorkingDays,
      "Total Working Hours": `${entry.totalWorkingHours} hrs`,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance Report");

    XLSX.writeFile(workbook, `Attendance_Report_${startDate}_to_${endDate}.xlsx`);
  };

  return (
    <Box p={3}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
        Attendance Report
      </Typography>

      <Box display="flex" gap={2} flexWrap="wrap" alignItems="flex-end" sx={{ mb: 2, mt: 2 }}>
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
        <TextField
          label="Start Date"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ minWidth: 200 }}
          size="small"
        />
        <TextField
          label="End Date"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ minWidth: 200 }}
          size="small"
        />
        <Button variant="outlined" color="secondary" onClick={handleReset} size="small"     sx={{ mb: 0.5 }}>
          Reset Filters
        </Button>
        <Button variant="contained"    color="success" onClick={handleExportToExcel} size="small"     sx={{ mb: 0.5 }}>
          Export to Excel
        </Button>
      </Box>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Sr No</TableCell>
                <TableCell>User Name</TableCell>
                <TableCell>Total Days</TableCell>
                <TableCell>Present Days</TableCell>
                <TableCell>Absent Days</TableCell>
                <TableCell>Half Days</TableCell>
                <TableCell>Week Offs</TableCell>
                <TableCell>Holidays</TableCell>
                <TableCell>Total Working Days</TableCell>
                <TableCell>Total Working Hours</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={10} align="center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : reportList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} align="center">
                    No data found.
                  </TableCell>
                </TableRow>
              ) : (
                reportList.map((entry, index) => (
                  <TableRow key={entry.user?.id || index}>
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>
                      {entry.user
                        ? `${entry.user.firstName} ${entry.user.lastName}`
                        : "N/A"}
                    </TableCell>
                    <TableCell>{entry.totalDays}</TableCell>
                    <TableCell>{entry.presentDays}</TableCell>
                    <TableCell>{entry.absentDays}</TableCell>
                    <TableCell>{entry.halfDays}</TableCell>
                    <TableCell>{entry.weekOffs}</TableCell>
                    <TableCell>{entry.holidays}</TableCell>
                    <TableCell>{entry.totalWorkingDays}</TableCell>
                    <TableCell>{entry.totalWorkingHours} hrs</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalReports}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};

export default AttendanceReport;
