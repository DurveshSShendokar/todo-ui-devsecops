import React, { useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TablePagination, Paper, IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useGetHolidays } from './hooks';

const HolidayTable = ({ onEdit, onDelete, searchKeyword ,year, month }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { data } = useGetHolidays({
    keyword: searchKeyword,
    year: year,
    month: month,
    page,
    size: rowsPerPage,
  });

  const holidays = data?.content || [];
  const totalCount = data?.totalElements || holidays.length;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>S.No.</TableCell> {/* Serial Number Column */}
            <TableCell>Holiday Name</TableCell>
            <TableCell>Remark</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {holidays.map((holiday, index) => (
            <TableRow key={holiday.id}>
              <TableCell>{page * rowsPerPage + index + 1}</TableCell>
              <TableCell>{holiday.holidayName}</TableCell>
              <TableCell>{holiday.remark}</TableCell>
              <TableCell>{holiday.date}</TableCell>
              <TableCell>
                <IconButton onClick={() => onEdit(holiday)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => onDelete(holiday.id)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={totalCount}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </TableContainer>
  );
};

export default HolidayTable;
