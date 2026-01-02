import React, { useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Checkbox, Button, Typography, Box, TextField, MenuItem, TablePagination,
  IconButton, Tooltip
} from '@mui/material';
import { Edit, AddCircleOutline } from '@mui/icons-material';
import {
  useGetAllAttendanceForAdmin,
  useGetUserAll,
  useUpdateAttendanceBulk,
  useUpdateAttendanceSingle,
  useCreateAttendanceSingle
} from './hook';
import CustomModal from '../../common/customModal';
import AdminAddEditForm from './form';
import dayjs from 'dayjs';

export default function AdminUserList() {
  const defaultEndDate = dayjs().format("YYYY-MM-DD");

  const [selectedIds, setSelectedIds] = useState([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editValues, setEditValues] = useState({ inTime: '', outTime: '', status: '' });
  const [editMode, setEditMode] = useState('multiple');
  const [selectedUserId, setSelectedUserId] = useState("");
  const [attendanceId, setAttendanceId] = useState("");
  const [currentUserId, setCurrentUserId] = useState("");
  const [endDate, setEndDate] = useState(defaultEndDate);

  const [page, setPage] = useState(0); // 0-based
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const updateAttendanceBulk = useUpdateAttendanceBulk();
  const updateAttendanceSingle = useUpdateAttendanceSingle(attendanceId);
  const createAttendanceSingle = useCreateAttendanceSingle(currentUserId);

  const { data } = useGetUserAll();
  const userData = data?.data || [];

  const { data: allUserAttendanceData } = useGetAllAttendanceForAdmin(
    endDate,
    selectedUserId,
    page + 1,
    rowsPerPage
  );

  const attendanceData = allUserAttendanceData?.content || [];
  const totalAttendanceCount = allUserAttendanceData?.totalElements || 0;

  const handleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (event) => {
    setSelectedIds(event.target.checked ? attendanceData.map((entry) => entry.id) : []);
  };

  const handleSingleEdit = (entry) => {
    setEditMode('single');
    setAttendanceId(entry.id || null);
    setCurrentUserId(entry.user?.id || "");
    setEditValues({
      inTime: entry.inTime || '',
      outTime: entry.outTime || '',
      status: entry.status || '',
    });
    setEditDialogOpen(true);
  };

  const handleOpenEditDialog = () => {
    setEditMode('multiple');
    setEditValues({ inTime: '', outTime: '', status: '' });
    setEditDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setEditDialogOpen(false);
    setEditValues({ inTime: '', outTime: '', status: '' });
    setSelectedIds([]);
    setSelectedUserId("");
  };

  const handleSave = (formData) => {
    const payload = {
      inTime: formData.inTime,
      outTime: formData.outTime,
      status: formData.status,
    };

    if (editMode === 'single') {
      if (!attendanceId) {
        // CREATE mode
        createAttendanceSingle.mutate(payload, {
          onSuccess: () => {
            handleCloseDialog();
          },
        });
      } else {
        // UPDATE mode
        updateAttendanceSingle.mutate(payload, {
          onSuccess: () => {
            handleCloseDialog();
          },
        });
      }
    } else {
      // Bulk edit
      const bulkPayload = {
        attendanceIds: selectedIds,
        ...payload,
      };
      updateAttendanceBulk.mutate(bulkPayload, {
        onSuccess: () => {
          handleCloseDialog();
        },
      });
    }
  };

  const handleReset = () => {
    setEndDate(defaultEndDate);
    setSelectedUserId("");
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


  return (
    <div style={{ padding: 24 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
        User Management Admin
      </Typography>

      <Box display="flex" gap={2} flexWrap="wrap" alignItems="flex-end">
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
          label="Date"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ minWidth: 200 }}
          size="small"
        />

        <Button
          variant="outlined"
          color="secondary"
          onClick={handleReset}
          sx={{ mb: 0.5 }}
          size="small"
        >
          Reset Filters
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ mb: 2, mt: 4 }}>
        {selectedIds.length > 1 && (
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2, mb: 2, ml: 2 }}
            onClick={handleOpenEditDialog}
          >
            Edit Selected ({selectedIds.length})
          </Button>
        )}
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedIds.length === attendanceData.length}
                  indeterminate={
                    selectedIds.length > 0 && selectedIds.length < attendanceData.length
                  }
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell>Sr No</TableCell>
              <TableCell>User Name</TableCell>
              <TableCell>In Time</TableCell>
              <TableCell>Out Time</TableCell>
              <TableCell>Status</TableCell>
              <TableCell sx={{ color: 'red' }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {attendanceData.map((entry, index) => (
              <TableRow key={entry.id || index} hover>
                <TableCell padding="checkbox">
                  {entry.id && (
                    <Checkbox
                      checked={selectedIds.includes(entry.id)}
                      onChange={() => handleSelect(entry.id)}
                    />
                  )}
                </TableCell>
                <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                <TableCell>{entry.user?.firstName} {entry.user?.lastName}</TableCell>
                <TableCell>{entry.inTime || "-"}</TableCell>
                <TableCell>{entry.outTime || "-"}</TableCell>
                <TableCell>{entry.status || "-"}</TableCell>
                <TableCell>
                  <Button
                    color={entry.id ? "primary" : "success"}
                    onClick={() => handleSingleEdit(entry)}
                  >
                    {entry.id ? <Edit /> : <AddCircleOutline />}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalAttendanceCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      <CustomModal
        isOpen={editDialogOpen}
        onClose={handleCloseDialog}
        dialogTitle={
          editMode === 'single'
            ? attendanceId
              ? 'Edit User Attendance'
              : 'Add User Attendance'
            : 'Edit Bulk Attendance'
        }
        dialogDescription={
          editMode === 'single'
            ? attendanceId
              ? 'Update time and status for the selected user'
              : 'Add time and status for a new attendance record'
            : `Update time and status for ${selectedIds.length} selected users`
        }
        formId="admin-edit-form"
      >
        <AdminAddEditForm
          initialData={editValues}
          onSubmit={handleSave}
          formId="admin-edit-form"
        />
      </CustomModal>
    </div>
  );
}
