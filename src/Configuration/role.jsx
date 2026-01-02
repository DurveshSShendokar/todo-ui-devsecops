import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Stack,
  Modal,
  TextField,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import BarChartIcon from "@mui/icons-material/BarChart";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CloseIcon from "@mui/icons-material/Close";
import { showToast, ToastTypes } from "../components/toast";
import * as XLSX from "xlsx";
import { Menu, MenuItem } from "@mui/material";
import { usePermissions } from "../Context/permissionContext";
import axios from "axios";

const BASE_URL = "http://20.219.1.165:8090/access";

const Role = ({darkMode}) => {
  const [roles, setRoles] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openModal, setOpenModal] = useState(false);
  const [roleName, setRoleName] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
const [editRoleId, setEditRoleId] = useState(null);

  const open = Boolean(anchorEl);
  const { routes } = usePermissions();
  console.log(routes);

  const handleMenuClick = (event, role) => {
    setAnchorEl(event.currentTarget);
    setSelectedRole(role);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRole(null);
  };
 const handleEdit = (role) => {
  setIsEditMode(true);
  setEditRoleId(role.roleId);
  setRoleName(role.roleName);
  setOpenModal(true);
};


  // const handleDelete = (role) => {
  //   console.log("Delete clicked:", role);
  // };


  // ✅ Delete a campaign
const handleDelete = async (id) => {
  try {
    await axios.delete(`${BASE_URL}/delete/${id}`);
       showToast("Role Delete successfully", ToastTypes.success);
    fetchRoles(); 
  } catch (error) {
    console.error("Error deleting campaign:", error);
        showToast( "Failed to delete role", ToastTypes.error);
    throw error;
  }
};



  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const res = await fetch(`${BASE_URL}/getRoles`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setRoles(data);
      } else {
        console.warn("Unexpected data:", data);
      }
    } catch (err) {
      console.error("Error fetching roles:", err);
    }
  };

  const exportToExcel = () => {
    if (roles.length === 0) return;

    const formattedData = roles.map((role, index) => ({
      "Sr No.": index + 1,
      "Role Name": role.roleName,
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Roles");

    XLSX.writeFile(workbook, "Roles.xlsx");
  };

const handleSaveRole = async () => {
  if (!roleName.trim()) return;

  try {
    const url = isEditMode
      ? `${BASE_URL}/edit/${editRoleId}`
      : `${BASE_URL}/addRole`;

    const method = isEditMode ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roleName }),
    });

    if (res.ok) {
      showToast(
        isEditMode ? " Role updated successfully" : " Role added successfully",
        ToastTypes.success
      );
      setRoleName("");
      setEditRoleId(null);
      setIsEditMode(false);
      setOpenModal(false);
      fetchRoles();
    } else {
      const errData = await res.json();
      showToast(errData.message || "Failed to save role", ToastTypes.error);
    }
  } catch (error) {
    console.error("Error saving role:", error);
    showToast("Server error", ToastTypes.error);
  }
};

const handleCloseModal = () => {
  setOpenModal(false);
  setRoleName("");
  setEditRoleId(null);
  setIsEditMode(false);
};

  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight="bold" >
        Role
      </Typography>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          color="primary"
          onClick={() => setOpenModal(true)}
          sx={{
            mt: 4,
          }}
        >
          Add New Role
        </Button>
        <Stack direction="row" spacing={2}>
          {/* <IconButton color="secondary"><CloudUploadIcon /></IconButton> */}
          <IconButton color="secondary" onClick={exportToExcel}>
            <FileDownloadIcon />
          </IconButton>
          {/* <IconButton color="secondary"><BarChartIcon /></IconButton> */}
        </Stack>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Sr No.</strong>
              </TableCell>
              <TableCell>
                <strong>Role Name</strong>
              </TableCell>
              <TableCell
                align="right"
                sx={{ width: "80px", paddingRight: "16px" }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {roles
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((role, index) => (
                <TableRow key={role.roleId}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{role.roleName}</TableCell>
                  <TableCell
                    align="right"
                    sx={{ width: "80px", paddingRight: "16px" }}
                  >
                    <IconButton onClick={(e) => handleMenuClick(e, role)}>
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <MenuItem
              onClick={() => {
                handleEdit(selectedRole);
                handleMenuClose();
              }}
            >
              Edit
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleDelete(selectedRole.roleId);
                handleMenuClose();
              }}
            >
              Delete
            </MenuItem>
          </Menu>
        </Table>

        <TablePagination
          component="div"
          count={roles.length}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </TableContainer>
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
         sx={(theme) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.primary.main}`,
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
  width: 800,
  color: theme.palette.text.primary,
})}

        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
          <Typography variant="h6" fontWeight="bold" color="#f50057">
  {isEditMode ? "Edit Role" : "Register Role"}
</Typography>

            <IconButton
          onClick={handleCloseModal}
              sx={{ color: "#fff" }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

      <Typography variant="body2" gutterBottom>
  {isEditMode ? "Update the role name below..." : "Register your role here..."}
</Typography>


          <TextField
            fullWidth
            label="Name"
            placeholder="Enter Name"
            variant="outlined"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            sx={{
              my: 2,
            
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "#ab47bc" },
            }}
          />

          <Stack direction="row" justifyContent="flex-end" spacing={2}>
            <Button
              onClick={handleCloseModal}
              variant="outlined"
              color="inherit"
            >
              Close
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleSaveRole}
            >
              Save
            </Button>
          </Stack>
        </Box>
      </Modal>
    </Box>
  );
};

export default Role;
