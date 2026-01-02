import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Paper,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { CategoryJson } from "../Context/CategoryJson";
import axios from "axios";
import { showToast, ToastTypes } from "../components/toast";

const Permission = () => {
  const [permissions, setPermissions] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuRow, setMenuRow] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openModal, setOpenModal] = useState(false);

  const [formData, setFormData] = useState({
    category: "",
    permission: "",
    navigationUrl: "",
  });

  // ⏬ Fetch all permissions
  const fetchPermissions = async () => {
    try {
      const res = await axios.get(
        "https://zioteams.zionit.in/access/getAllPermissions"
      );
      if (Array.isArray(res.data)) {
        setPermissions(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch permissions:", err);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "category") {
      setFormData({
        category: value,
        permission: "",
        navigationUrl: "",
      });
    } else if (name === "permission") {
      const navUrl =
        CategoryJson[formData.category]?.find(
          (item) => item.permissionsName === value
        )?.navigationUrl || "";

      setFormData((prev) => ({
        ...prev,
        permission: value,
        navigationUrl: navUrl,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleModalClose = () => {
    setOpenModal(false);
    setFormData({ category: "", permission: "", navigationUrl: "" });
  };

  const handleSavePermission = async () => {
    try {
      await axios.post("https://zioteams.zionit.in/access/addPermission", {
        category: formData.category,
        permissionsName: formData.permission,
        navigationUrl: formData.navigationUrl,
      });
    showToast("Permission Add Successfull!!", ToastTypes.success);
      fetchPermissions(); // Refresh table
      handleModalClose();
    } catch (err) {
      console.error("Error adding permission:", err);
    }
  };

  const handleOpenMenu = (event, row) => {
    setAnchorEl(event.currentTarget);
    setMenuRow(row);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setMenuRow(null);
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight="bold" >
        Permission
      </Typography>

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setOpenModal(true)}
          sx={{mt:4}}
        >
          Add Permission
        </Button>
        <Box>
          {/* <IconButton color="primary">
            <DownloadIcon />
          </IconButton>
          <IconButton color="primary">
            <SettingsApplicationsIcon />
          </IconButton> */}
        </Box>
      </Box>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Sr No.</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Permission Name</TableCell>
                <TableCell>Navigation URL</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {permissions
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>{row.category}</TableCell>
                    <TableCell>{row.permissionsName}</TableCell>
                    <TableCell>{row.navigationUrl}</TableCell>
                   
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={permissions.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Paper>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        <MenuItem
          onClick={() => {
            console.log("Edit", menuRow);
            handleCloseMenu();
          }}
        >
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => {
            console.log("Delete", menuRow);
            handleCloseMenu();
          }}
        >
          Delete
        </MenuItem>
      </Menu>

      {/* Modal */}
      <Dialog
        open={openModal}
        onClose={handleModalClose}
        fullWidth
        maxWidth="md"
        PaperProps={{
          style: {
            backgroundColor: "#000",
            color: "#ffffff",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>
          Add Permission
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                name="category"
                label="Category"
                value={formData.category}
                onChange={handleInputChange}
                SelectProps={{
                  MenuProps: {
                    PaperProps: {
                      style: { backgroundColor: "#2A2D50", color: "white" },
                    },
                  },
                }}
                InputLabelProps={{ style: { color: "#fff" } }}
                InputProps={{ style: { color: "#fff" } }}
              >
                {Object.keys(CategoryJson).map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                name="permission"
                label="Permission"
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
                InputProps={{ style: { color: "#fff" } }}
                disabled={!formData.category}
              >
                {(CategoryJson[formData.category] || []).map((item) => (
                  <MenuItem
                    key={item.permissionsName}
                    value={item.permissionsName}
                  >
                    {item.permissionsName}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                name="navigationUrl"
                label="Navigation URL"
                value={formData.navigationUrl}
                onChange={handleInputChange}
                InputProps={{ readOnly: true }}
                InputLabelProps={{ style: { color: "#fff" } }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={handleModalClose}
            sx={{ backgroundColor: "#444" }}
          >
            Close
          </Button>
          <Button
            variant="contained"
            onClick={handleSavePermission}
            sx={{ backgroundColor: "#D63384" }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Permission;
