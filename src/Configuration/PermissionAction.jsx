import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  MenuItem,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DownloadIcon from "@mui/icons-material/Download";
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import { CategoryJson } from "../Context/CategoryJson";
import axios from "axios";

const PermissionAction = () => {
  const [permissionsData, setPermissionsData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    permission: "",
    action: "",
  });

  const baseURL = "http://20.219.1.165:8090/access";

  useEffect(() => {
    fetchAllPermissions();
  }, []);

  const fetchAllPermissions = async () => {
    try {
      const res = await axios.get(`${baseURL}/getAllPermissions`);
      const apiData = res.data || [];

      // map category using CategoryJson
      const updatedData = apiData.map((item) => {
        const category = findCategoryByPermission(item.permissionName);
        return {
          ...item,
          category,
        };
      });

      setPermissionsData(updatedData);
    } catch (error) {
      console.error("Error fetching all permissions:", error);
    }
  };

  const findCategoryByPermission = (permissionName) => {
    for (const cat in CategoryJson) {
      const permissions = CategoryJson[cat];
      if (permissions.find((perm) => perm.permissionsName === permissionName)) {
        return cat;
      }
    }
    return "-"; // not found
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleModalClose = () => {
    setOpenModal(false);
    setFormData({ permission: "", action: "" });
  };

  const handleSavePermissionAction = async () => {
    try {
      setLoading(true);

      const payload = {
        permissionName: formData.permission,
        actionName: formData.action,
      };

      await axios.post(`${baseURL}/addPermissionAction`, payload);
      await fetchAllPermissions();
      handleModalClose();
    } catch (error) {
      console.error("Error adding permission action:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const allPermissions = Object.values(CategoryJson)
    .flat()
    .map((item) => item.permissionsName);

  const allActions = Array.from(
    new Set(
      Object.values(CategoryJson)
        .flat()
        .flatMap((item) => item.actions)
    )
  );

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight="bold" color="purple">
          Permission Action
        </Typography>
        <Box>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<AddIcon />}
            sx={{ mr: 2 }}
            onClick={() => setOpenModal(true)}
          >
            Add New
          </Button>
          <IconButton color="primary">
            <DownloadIcon />
          </IconButton>
          <IconButton color="primary">
            <SettingsApplicationsIcon />
          </IconButton>
        </Box>
      </Box>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Sr No.</TableCell>
                <TableCell>Action Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Permission Name</TableCell>
                {/* <TableCell>Available</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {permissionsData.length > 0 ? (
                permissionsData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                      <TableCell>{row.actionName || "-"}</TableCell>
                      <TableCell>{row.category}</TableCell>
                      <TableCell>{row.permissionsName}</TableCell>
                      {/* <TableCell>{row.available ? "Yes" : "No"}</TableCell> */}
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No Data Found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={permissionsData.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Paper>

      {/* Modal */}
      <Dialog
        open={openModal}
        onClose={handleModalClose}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          style: {
            backgroundColor: "#1A1A2E",
            color: "#ffffff",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>
          Add Permission Action
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                name="permission"
                label="Select Permission"
                value={formData.permission}
                onChange={handleInputChange}
                SelectProps={{
                  MenuProps: {
                    PaperProps: {
                      style: { backgroundColor: "#2A2D50", color: "white" },
                    },
                  },
                }}
                InputLabelProps={{ style: { color: "#fff" } }}
              >
                {allPermissions.map((permission) => (
                  <MenuItem key={permission} value={permission}>
                    {permission}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                name="action"
                label="Select Action"
                value={formData.action}
                onChange={handleInputChange}
                SelectProps={{
                  MenuProps: {
                    PaperProps: {
                      style: { backgroundColor: "#2A2D50", color: "white" },
                    },
                  },
                }}
                InputLabelProps={{ style: { color: "#fff" } }}
              >
                {allActions.map((action) => (
                  <MenuItem key={action} value={action}>
                    {action}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleModalClose} sx={{ backgroundColor: "#444" }}>
            Close
          </Button>
          <Button
            variant="contained"
            onClick={handleSavePermissionAction}
            disabled={loading}
            sx={{ backgroundColor: "#D63384" }}
          >
            {loading ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PermissionAction;
