import React from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  TablePagination,
  Paper,
  Box,
  useTheme,
} from "@mui/material";
import { Edit } from "@mui/icons-material";
import { useGetAttendanceUserAll } from "./hook";

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

const AttendanceTable = ({
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onEdit,
  userId,
  month,
  year,
}) => {
  const theme = useTheme();
  const { data, isLoading } = useGetAttendanceUserAll({
    userId,
    month,
    year,
  });
  
const attendanceList = (data?.data || []).sort(
  (a, b) => new Date(b.date) - new Date(a.date)
);


  const formatTime12Hour = (timeStr) => {
    if (!timeStr) return "-";
    const [hours, minutes] = timeStr.split(":");
    const date = new Date();
    date.setHours(Number(hours), Number(minutes));
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <Paper elevation={3} className="overflow-auto rounded-lg">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>In Time</TableCell>
            <TableCell>Out Time</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Total Hours</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {attendanceList
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((entry, index) => (
              <TableRow key={entry.id}>
                <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                <TableCell>{formatDate(entry.date)}</TableCell>

                {/* In Time */}
                <TableCell>
                  {entry.inTime ? (
                    <Box
                      sx={{
                        backgroundColor: "#d0f0c0",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        display: "inline-block",
                        color: theme.palette.mode === "dark" ? "black" : "black",
                      }}
                    >
                      {formatTime12Hour(entry.inTime)}
                    </Box>
                  ) : (
                    "-"
                  )}
                </TableCell>

                {/* Out Time */}
                <TableCell>
                  {entry.outTime ? (
                    <Box
                      sx={{
                        backgroundColor: "#f8d7da",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        display: "inline-block",
                        color: theme.palette.mode === "dark" ? "black" : "black",
                      }}
                    >
                      {formatTime12Hour(entry.outTime)}
                    </Box>
                  ) : (
                    "-"
                  )}
                </TableCell>

                {/* Status */}
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      entry.status === "Present"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {entry.status || "-"}
                  </span>
                </TableCell>

                <TableCell>{entry.totalHours || "-"}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => onEdit(entry)}>
                    <Edit />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={attendanceList.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
      />
    </Paper>
  );
};

export default AttendanceTable;
