// components/ApprovalTable.js

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TablePagination,
  Box,
} from "@mui/material";

const ApprovalTable = ({
  data,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onApprove,
  tabIndex,
}) => {
 const sortedData = [...data].sort((a, b) => new Date(b.date) - new Date(a.date));
const paginatedData = sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);


  
const getStatusColor = (status) => {
  switch (status) {
    case "PRESENT":
      return { text: "#2e7d32", bg: "#c8e6c9" }; // green
    case "ABSENT":
      return { text: "#c62828", bg: "#ffcdd2" }; // red
    case "HALFDAY":
      return { text: "#f9a825", bg: "#fff9c4" }; // yellow
    case "LEAVE":
      return { text: "#1565c0", bg: "#bbdefb" }; // blue
    default:
      return { text: "#424242", bg: "#e0e0e0" }; // grey fallback
  }
};

  return (
    <TableContainer component={Box} p={2}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Sr No</TableCell>
            <TableCell>User</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>In Time</TableCell>
            <TableCell>Out Time</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} align="center">
                {tabIndex === 0 ? "No pending approvals." : "No approved records found."}
              </TableCell>
            </TableRow>
          ) : (
            paginatedData.map((entry, index) => (
              <TableRow key={entry.id}>
                <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                <TableCell>{entry.user?.firstName} {entry.user?.lastName}</TableCell>
                <TableCell>{entry.date}</TableCell>
                <TableCell>{entry.inTime}</TableCell>
                <TableCell>{entry.outTime}</TableCell>
                <TableCell>
  <Box
    sx={{
      display: "inline-block",
      px: 1.5,
      py: 0.5,
      borderRadius: "12px",
      fontSize: "0.75rem",
      fontWeight: 600,
      color: getStatusColor(entry.status).text,
      backgroundColor: getStatusColor(entry.status).bg,
      textTransform: "uppercase",
    }}
  >
    {entry.status}
  </Box>
</TableCell>

                <TableCell>
                  {entry.isApproved === 1 ? (
                    <Button variant="contained" color="success" disabled>
                      Approved
                    </Button>
                  ) : (
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => onApprove(entry)}
                    >
                      Approve
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <TablePagination
        component="div"
        count={data.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </TableContainer>
  );
};

export default ApprovalTable;
