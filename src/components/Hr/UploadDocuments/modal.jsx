import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Grid,
  Typography,
  Box,
  Input,
  List,
  ListItem,
  ListItemText,
  Paper,
  Checkbox,
  TablePagination,
} from "@mui/material";
import { UploadFile } from "@mui/icons-material";

const FileUploadModal = ({
  open,
  onClose,
  users,
  onUpload,
  selectedUsers = [],
  allowSelection = true,
  darkMode,
}) => {
  const [files, setFiles] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState(selectedUsers);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);

  useEffect(() => {
    setSelectedUserIds(selectedUsers);
  }, [selectedUsers]);

  const handleFileInput = (event) => {
    setFiles(Array.from(event.target.files));
  };

  const handleUserSelection = (userId) => {
    if (!allowSelection) return;
    setSelectedUserIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSubmit = () => {
    onUpload(selectedUserIds, files);
    onClose();
    setFiles([]);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedUsers = users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle
        sx={{
          backgroundColor: darkMode ? "#121212" : "#fff",
          color: darkMode ? "#fff" : "#000",
        }}
      >
        Upload Documents
      </DialogTitle>

      <DialogContent
        sx={{
          backgroundColor: darkMode ? "#1e1e1e" : "#fafafa",
          color: darkMode ? "#ddd" : "#000",
        }}
      >
        <Typography variant="body1" gutterBottom sx={{ mt: 2 }}>
          {allowSelection
            ? "Select users and upload documents:"
            : "Upload documents for user:"}
        </Typography>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          {paginatedUsers.map((user) => {
            const isSelected = selectedUserIds.includes(user.id);
            return (
              <Grid item xs={12} sm={6} md={4} key={user.id}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 1.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderRadius: 2,
                    cursor: allowSelection ? "pointer" : "default",
                    border: isSelected
                      ? "2px solid #1976d2"
                      : `1px solid ${darkMode ? "#444" : "#ccc"}`,
                    backgroundColor: isSelected
                      ? darkMode
                        ? "#263238"
                        : "#e3f2fd"
                      : darkMode
                      ? "#121212"
                      : "#fff",
                    color: darkMode ? "#eee" : "#000",
                    "&:hover": {
                      backgroundColor: darkMode ? "#1a1a1a" : "#f5f5f5",
                    },
                  }}
                  onClick={() => handleUserSelection(user.id)}
                >
                  <Box>
                    <Typography variant="subtitle2">
                      {user.firstName} {user.lastName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {user.emailId}
                    </Typography>
                  </Box>
                  <Checkbox
                    checked={isSelected}
                    onChange={() => handleUserSelection(user.id)}
                    color="primary"
                    sx={{ pointerEvents: "none" }}
                  />
                </Paper>
              </Grid>
            );
          })}
        </Grid>

        <TablePagination
          component="div"
          count={users.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[6, 12, 24]}
          sx={{
            color: darkMode ? "#fff" : undefined,
            borderTop: darkMode ? "1px solid #444" : undefined,
          }}
        />

        <Box mt={2}>
          <Box display="flex" alignItems="center" gap={2}>
            <label htmlFor="file-upload">
              <Input
                id="file-upload"
                type="file"
                inputProps={{ multiple: true }}
                onChange={handleFileInput}
                style={{ display: "none" }}
              />
              <Button
                variant="outlined"
                component="span"
                startIcon={<UploadFile />}
                sx={{
                  width: 180,
                  color: darkMode ? "#fff" : undefined,
                  borderColor: darkMode ? "#888" : undefined,
                }}
              >
                Choose Files
              </Button>
            </label>

            <Button
              variant="text"
              color="error"
              disabled={files.length === 0}
              onClick={() => setFiles([])}
            >
              Reset
            </Button>
          </Box>

          {files.length > 0 && (
            <List dense sx={{ mt: 1 }}>
              {files.map((file, index) => (
                <ListItem key={index}>
                  <ListItemText primary={file.name} />
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          backgroundColor: darkMode ? "#1e1e1e" : "#fafafa",
          color: darkMode ? "#fff" : "#000",
        }}
      >
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          variant="contained"
          disabled={files.length === 0 || selectedUserIds.length === 0}
        >
          Upload
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FileUploadModal;
