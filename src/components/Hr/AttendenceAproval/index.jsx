import React, { useEffect, useState } from "react";
import {
  Tabs,
  Tab,
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TablePagination,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useGetAllAprovals, useGetPendingAprovals, useUpdateAttendanceApproval, useUpdateAttendanceStatus } from "./hook";
import { useGetUserAll } from "../AutoAttendance/hook";
import ApprovalTable from "./aprovalTable";

const AttendanceApprovalTabs = () => {
  const [tabIndex, setTabIndex] = useState(0);
const theme = useTheme();
const isMobile = useMediaQuery(theme.breakpoints.down("sm"));


  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1; 
  const currentYear = currentDate.getFullYear();
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [userId, setUserId] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangeTab = (_, newValue) => {
    setTabIndex(newValue);
    setPage(0);
  };

  const { data: userDataa, isLoading } = useGetUserAll();
  const userData = userDataa?.data || [];

  const { data: dataaa } = useGetPendingAprovals(userId,selectedMonth,selectedYear);
  const tableData = dataaa?.data || [];

  const { data: dataa } = useGetAllAprovals();
  const tableDataAll = dataa?.data || [];

  console.log("tableData", tableDataAll);

 const updateAttendanceStatus = useUpdateAttendanceStatus();
  const updateAttendanceApproval = useUpdateAttendanceApproval();

 const handleApprove = (formData) => {
  
  updateAttendanceApproval.mutate({
    id: formData.id, 
    data: {
      userId: formData.user.id,
      date: formData.date,
      inTime: formData.inTime,
      outTime: formData.outTime,
    },
  });

  updateAttendanceStatus.mutate({
    id: formData.id,
    status: formData.status,
    isApproved: 1,
  });
};


  const filteredData = tabIndex === 0 ? tableData : tableDataAll;



  const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  // Month names for display
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <Box   className="p-2" >
      {" "}
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
        Attendance Approvals
      </Typography>
      <Paper>
        <Box
          sx={{ borderBottom: 1, borderColor: "divider", px: 2, pt: 2, mt: 2 }}
        >
          <Tabs value={tabIndex} onChange={handleChangeTab} sx={{ mt: 2 }}>
            <Tab label="Pending Approvals" />
            <Tab label="All Approvals" />
          </Tabs>
        </Box>
       <Box
  display="flex"
  gap={4}
  mt={2}
  flexWrap={isMobile ? "wrap" : "nowrap"}
  sx={{
    "& > *": {
      flexBasis: isMobile ? "100%" : "auto",
      minWidth: isMobile ? "100%" : "auto",
      ml: isMobile ? 0 : 2,
    },
  }}
>
  <TextField
    select
    label="Select User"
    value={userId}
    onChange={(e) => setUserId(e.target.value)}
    size="small"
    sx={{ minWidth: isMobile ? "100%" : 200 ,    ml: isMobile ? 0 : 2, }}
  >
    {isLoading ? (
      <MenuItem disabled>Loading...</MenuItem>
    ) : (
      userData.map((user) => (
        <MenuItem key={user.id} value={user.id}>
          {user.firstName}-{user.lastName}
        </MenuItem>
      ))
    )}
  </TextField>

  <FormControl
    variant="outlined"
    size="small"
    sx={{ minWidth: isMobile ? "100%" : 150 }}
  >
    <InputLabel>Month</InputLabel>
    <Select
      value={selectedMonth}
      onChange={(e) => setSelectedMonth(Number(e.target.value))}
      label="Month"
    >
      {monthNames.map((name, index) => (
        <MenuItem key={index} value={index + 1}>
          {name}
        </MenuItem>
      ))}
    </Select>
  </FormControl>

  <FormControl
    variant="outlined"
    size="small"
    sx={{ minWidth: isMobile ? "100%" : 150 }}
  >
    <InputLabel>Year</InputLabel>
    <Select
      value={selectedYear}
      onChange={(e) => setSelectedYear(Number(e.target.value))}
      label="Year"
    >
      {years.map((year) => (
        <MenuItem key={year} value={year}>
          {year}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
</Box>
       <ApprovalTable
  data={filteredData}
  page={page}
  rowsPerPage={rowsPerPage}
  onPageChange={(_, newPage) => setPage(newPage)}
  onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
  onApprove={handleApprove}
  tabIndex={tabIndex}
/>
      </Paper>
    </Box>
  );
};

export default AttendanceApprovalTabs;
