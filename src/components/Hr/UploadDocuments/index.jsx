import React, { useState } from "react";
import {
  Button,
  Grid,
  Typography,
  Paper,
  Box,
  IconButton,
  Container,
  Tooltip,
  TextField,
  TablePagination,
} from "@mui/material";
import { UploadFile } from "@mui/icons-material";
import { useGetUserAll } from "../AutoAttendance/hook";
import FileUploadModal from "./modal";

const UploadDocumentsAdmin = ({ darkMode }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [singleUploadUser, setSingleUploadUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { data, isLoading } = useGetUserAll();
  const users = data?.data || [];

  const filteredUsers = users.filter((user) =>
    `${user.firstName} ${user.lastName} ${user.emailId}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const paginatedUsers = filteredUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleUserUpload = (user) => {
    setSingleUploadUser(user);
    setModalOpen(true);
  };

  const handleBulkUpload = () => {
    setSingleUploadUser(null);
    setSelectedUsers([]);
    setModalOpen(true);
  };

  const handleUpload = (userIds, files) => {
    console.log("Uploading files for:", userIds);
    console.log("Files:", files);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
          User Document Upload
        </Typography>
      </Box>

      <Box display="flex" gap={2} alignItems="center" flexWrap="wrap" sx={{ mb: 3 }}>
        <TextField
          label="Search user"
          variant="outlined"
          size="small"
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button variant="contained" onClick={handleBulkUpload} startIcon={<UploadFile />}>
          Upload for Multiple Users
        </Button>
      </Box>

      <Grid container spacing={2}>
        {paginatedUsers.map((user) => (
          <Grid item xs={12} sm={6} md={4} key={user.id}>
            <Paper
              elevation={3}
              sx={{
                p: 2,
                borderRadius: "10px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography variant="subtitle1">
                  {user.firstName} {user.lastName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user.emailId}
                </Typography>
              </Box>
              <Tooltip title="Upload Document">
                <IconButton color="primary" onClick={() => handleUserUpload(user)}>
                  <UploadFile />
                </IconButton>
              </Tooltip>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <TablePagination
        component="div"
        count={filteredUsers.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{ mt: 3 }}
      />

      <FileUploadModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        users={singleUploadUser ? [singleUploadUser] : users}
        selectedUsers={singleUploadUser ? [singleUploadUser.id] : selectedUsers}
        onUpload={handleUpload}
        allowSelection={!singleUploadUser}
        darkMode={darkMode}
      />
    </Container>
  );
};

export default UploadDocumentsAdmin;
