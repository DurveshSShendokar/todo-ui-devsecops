import React, { useState, useEffect } from "react";
import {
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  IconButton,
  TablePagination,
  Checkbox,
  Box,
  Button,
} from "@mui/material";
import { Edit } from "@mui/icons-material";
import { useGetAllAutoAttendanceUser } from "./hook";

const AutoAttendanceTable = ({ onEdit, onBulkSelect, onEditClick }) => {
  const { data, isLoading } = useGetAllAutoAttendanceUser();
  const tableData = data?.data || [];

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedIds, setSelectedIds] = useState([]);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedData = tableData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const isAllSelected =
    paginatedData.length > 0 &&
    paginatedData.every((entry) => selectedIds.includes(entry.id));

  const handleSelectOne = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (checked) => {
    const idsOnPage = paginatedData.map((entry) => entry.id);
    setSelectedIds((prev) =>
      checked
        ? [...new Set([...prev, ...idsOnPage])]
        : prev.filter((id) => !idsOnPage.includes(id))
    );
  };

  // Send selected IDs to parent on change
  useEffect(() => {
    onBulkSelect?.(selectedIds);
  }, [selectedIds]);

  return (
    <Paper>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        p={2}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={onEditClick}
          disabled={selectedIds.length === 0}
        >
          Edit Auto Attendance ({selectedIds.length})
        </Button>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={isAllSelected}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </TableCell>
              <TableCell>Sr No</TableCell>
              <TableCell>User Name</TableCell>
              <TableCell>Is Active</TableCell>
              <TableCell>Sign-In Time</TableCell>
              <TableCell>Sign-Out Time</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No auto attendance records found.
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((entry, index) => (
                <TableRow key={entry.id}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedIds.includes(entry.id)}
                      onChange={() => handleSelectOne(entry.id)}
                    />
                  </TableCell>
                  <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell>
                    {`${entry.user?.firstName ?? ""} ${
                      entry.user?.lastName ?? ""
                    }`}
                  </TableCell>
                  <TableCell>{entry.isActive ? "Yes" : "No"}</TableCell>
                  <TableCell>
                    {entry.signInTime
                      ? typeof entry.signInTime === "string"
                        ? entry.signInTime.slice(0, 5) // Trim "HH:mm:SS" to "HH:mm"
                        : `${String(entry.signInTime.hour).padStart(
                            2,
                            "0"
                          )}:${String(entry.signInTime.minute).padStart(
                            2,
                            "0"
                          )}`
                      : "-"}
                  </TableCell>

                  <TableCell>
                    {entry.outTime
                      ? typeof entry.outTime === "string"
                        ? entry.outTime.slice(0, 5) // Same here
                        : `${String(entry.outTime.hour).padStart(
                            2,
                            "0"
                          )}:${String(entry.outTime.minute).padStart(2, "0")}`
                      : "-"}
                  </TableCell>

                  <TableCell>
                    <IconButton color="primary" onClick={() => onEdit(entry)}>
                      <Edit />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={tableData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default AutoAttendanceTable;
