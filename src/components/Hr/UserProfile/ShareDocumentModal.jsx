import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  TextField,
  Autocomplete,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  Divider,
  Grid,
  Paper,
  Box,
  TablePagination,
} from "@mui/material";
import { deleteRequest, postRequest } from "../../../utils/apiClient";
import { showToast, ToastTypes } from "../../toast";

const ShareDocumentModal = ({
  open,
  onClose,
  documentId,
  alreadySharedUsers = [],
  allUsers = [],
  onSharedSuccess,
  darkMode = false,
}) => {
  const [email, setEmail] = useState("");
  const [selectedUserToUnshare, setSelectedUserToUnshare] = useState([]);
  console.log("dddd", alreadySharedUsers);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);

  useEffect(() => {
    if (open) {
      setEmail("");
      setSelectedUserToUnshare([]);
    }
  }, [open]);

  const paginatedUsers = alreadySharedUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleUnshareToggle = (userId) => {
    setSelectedUserToUnshare((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleUnshare = async () => {
    try {
      await Promise.all(
        selectedUserToUnshare.map((userId) =>
          deleteRequest(
            `/api/document-sharing/unshare?documentId=${documentId}&userId=${userId}`
          )
        )
      );
      showToast("Unshared successfully", ToastTypes.success);
      onSharedSuccess?.();
      setSelectedUserToUnshare([]);
      // onClose();
    } catch (error) {
      showToast("Failed to unshare", ToastTypes.error);
    }
  };

  const handleShare = async () => {
    if (!email) return;
    try {
      await postRequest(
        `/api/document-sharing/share-email?documentId=${documentId}&email=${encodeURIComponent(
          email
        )}`
      );
      showToast("Document shared via email.", ToastTypes.success);
      onSharedSuccess?.();
      setEmail("");
      onClose();
    } catch (error) {
      showToast("Failed to share", ToastTypes.error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle
        sx={{
          bgcolor: darkMode ? "#121212" : "#fff",
          color: darkMode ? "#fff" : "#000",
        }}
      >
        Share Document
      </DialogTitle>

      <DialogContent
        sx={{
          bgcolor: darkMode ? "#1e1e1e" : "#fafafa",
          color: darkMode ? "#ddd" : "#000",
        }}
      >
        {/* Already Shared Users */}
        <Typography variant="subtitle1" gutterBottom>
          Already Shared With:
        </Typography>
        {paginatedUsers.length > 0 ? (
          <>
            <Grid container spacing={2} sx={{ mb: 2 }}>
              {paginatedUsers.map((user) => {
                const isSelected = selectedUserToUnshare.includes(user.id);
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
                        cursor: "pointer",
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
                      onClick={() => handleUnshareToggle(user.id)}
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
              count={alreadySharedUsers.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[6, 12, 24]}
              sx={{
                color: darkMode ? "#fff" : undefined,
                borderTop: darkMode ? "1px solid #444" : undefined,
                mt: 1,
              }}
            />
          </>
        ) : (
          <Typography variant="body2" color="textSecondary">
            This document hasn’t been shared yet.
          </Typography>
        )}

        <Divider sx={{ my: 2, borderColor: darkMode ? "#555" : "#ccc" }} />

        {/* Email Suggestion Section */}
        <Typography variant="subtitle1" gutterBottom>
          Share with a new user via Email:
        </Typography>
        <Autocomplete
          freeSolo
          options={allUsers.map((u) => u.emailId)}
          value={email}
          onInputChange={(e, newVal) => setEmail(newVal)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Enter email"
              variant="outlined"
              type="email"
              fullWidth
              sx={{
                input: { color: darkMode ? "#fff" : "inherit" },
                label: { color: darkMode ? "#bbb" : undefined },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: darkMode ? "#555" : undefined,
                  },
                  "&:hover fieldset": {
                    borderColor: darkMode ? "#888" : undefined,
                  },
                },
              }}
            />
          )}
        />
      </DialogContent>

      <DialogActions sx={{ bgcolor: darkMode ? "#1e1e1e" : "#fafafa" }}>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        {selectedUserToUnshare.length > 0 && (
          <Button onClick={handleUnshare} variant="outlined" color="error">
            Unshare Selected
          </Button>
        )}
        <Button
          onClick={handleShare}
          variant="contained"
          color="primary"
          disabled={!email}
        >
          Share
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ShareDocumentModal;
