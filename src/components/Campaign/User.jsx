import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  IconButton,
  Menu,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { fetchData, postRequest } from "../../utils/apiClient";
import { useGetUserAll } from "../Hr/AutoAttendance/hook";
import { showToast, ToastTypes } from "../toast";

const User = ({darkMode}) => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openModal, setOpenModal] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
const [isEditMode, setIsEditMode] = useState(false);
const [editingUserId, setEditingUserId] = useState(null);
const [dateOfJoining, setDateOfJoining] = useState("");
const [department, setDepartment] = useState("");
const [designation, setDesignation] = useState("");
const [managerId, setManagerId] = useState("");
const [hrManagerId, setHrManagerId] = useState("");
const [changePasswordDialog, setChangePasswordDialog] = useState(false);
const [selectedRowEmail, setSelectedRowEmail] = useState("");
const [oldPassword, setOldPassword] = useState("");
const [newPassword, setNewPassword] = useState("");


  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    mobileNumber: "",
    emailId: "",
    password: "",
    roleId: "",
  });

  const getAllUsers = async () => {
    try {
      const response = await fetchData("/user/getAllUsers");
      const result = Array.isArray(response?.data) ? response.data : response?.data ? [response.data] : [];
  
  
      const enrichedUsers = result.map((user) => {
        const matchedRole = roles.find((role) => role.roleId === user.roleId);
        return {
          ...user,
          role: matchedRole ? { ...matchedRole } : user.role || null,
        };
      });
  
      setUsers(enrichedUsers);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };
  
const { data: userDataa, isLoading: loadingUsers } = useGetUserAll();
const userData = userDataa?.data || [];

  const getAllRoles = async () => {
    try {
      const response = await fetchData("/access/getRoles");
      if (Array.isArray(response)) setRoles(response);
    } catch (err) {
      console.error("Error fetching roles:", err);
    }
  };

  useEffect(() => {
    getAllUsers();
    getAllRoles();
  }, []);

  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(+e.target.value);
    setPage(0);
  };

  const handleMenuOpen = (event, row) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


const resetForm = () => {
  setFirstName("");
  setLastName("");
  setMobileNumber("");
  setEmailId("");
  setPassword("");
  setSelectedRoleId("");
  setIsEditMode(false);
  setEditingUserId(null);
};


const handleRegisterUser = async () => {
  try {
  const payload = {
  ...(isEditMode && { id: editingUserId }),
  firstName,
  lastName,
  mobileNumber,
  emailId,
  password,
  roleId: Number(selectedRoleId),
  dateOfJoining,
  department,
  designation,
  managerId: Number(managerId),
    hrManagerId: Number(hrManagerId),
};

    const url = isEditMode
      ? "/user/updateUser"
      : "/user/register-admin";

    const method = isEditMode ? "POST" : "POST";

    const response = await fetchData(url, {
      method,
      body: JSON.stringify(payload),
    });

    if (response || response?.message?.includes("successfully")) {
          showToast(response?.message || "Operation Successful", ToastTypes.success);
      console.log(isEditMode ? "User updated!" : "User registered!");
      getAllUsers();
      setOpenModal(false);
      resetForm();
    } else {
      console.error("Operation failed", response);
        showToast(response?.message || "Operation Failed", ToastTypes.error);
    }
  } catch (error) {
    console.error("Error submitting user:", error);
  }
};


const handleDeleteUser = async (userId) => {
  if (!window.confirm("Are you sure you want to delete this user?")) return;

  try {
    const response = await fetchData(`/user/deleteUser/${userId}`, {
      method: "GET",
    });

    if (response || response?.message?.includes("successfully")) {
        showToast(response?.message || "Operation Successful", ToastTypes.success);
      console.log("User deleted successfully");
      getAllUsers(); // Refresh the user list
    } else {
      console.error("Failed to delete user:", response);
              showToast(response?.message || "Operation Failed", ToastTypes.error);
    }
  } catch (error) {
    console.error("Error deleting user:", error);
  }
};

const handleChangePassword = async () => {
  try {
    const payload = {
      newPassword,
      userEmail: selectedRowEmail,
    };

    const response = await fetchData("/user/change-password", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response ) {
      showToast(response?.message || "Password changed successfully", ToastTypes.success);
    } else {
      showToast(response?.message || "Failed to change password", ToastTypes.error);
    }
  } catch (error) {
    showToast("An error occurred while changing password", ToastTypes.error);
  } finally {
    setChangePasswordDialog(false);
    setNewPassword("");
    setSelectedRowEmail("");
  }
};



  return (
    <Box p={3}>
    
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
         <Button
         variant="contained"
          startIcon={<AddIcon />}
          // sx={{ backgroundColor: "#d63384", "&:hover": { backgroundColor: "#c02570" } }}
          onClick={() => setOpenModal(true)}
        >
          Add New User
        </Button>
     
            <Typography variant="h4" fontWeight="bold" textAlign="center">
                User
              </Typography>
          <Typography variant="h5" fontWeight="bold" color="purple">
      
        </Typography>
      </Box>
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Sr. No.</TableCell>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Contact No</TableCell>
                <TableCell>Email</TableCell>
                {/* <TableCell>Password</TableCell> */}
                <TableCell>Role</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user, index) => (
                <TableRow key={user.id || index}>
                  <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell>{user.firstName}</TableCell>
                  <TableCell>{user.lastName}</TableCell>
                  <TableCell>{user.mobileNumber}</TableCell>
                  <TableCell>{user.emailId}</TableCell>
                  {/* <TableCell>{user.password || "N/A"}</TableCell> */}
                  <TableCell>{user?.role?.roleName || user?.roleName || "N/A"}</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={(e) => handleMenuOpen(e, user)}>
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={users.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

    
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        {/* <MenuItem onClick={() => { console.log("Edit", selectedRow); handleMenuClose(); }}>
          Edit
        </MenuItem> */}
      <MenuItem onClick={() => {
  setIsEditMode(true);
  setEditingUserId(selectedRow.id);
  setFirstName(selectedRow.firstName || "");
  setLastName(selectedRow.lastName || "");
  setMobileNumber(selectedRow.mobileNumber || "");
  setEmailId(selectedRow.emailId || "");
  setPassword("");
  setSelectedRoleId(
    selectedRow.roleId?.toString() || selectedRow.role?.roleId?.toString() || ""
  );
  setDateOfJoining(selectedRow.dateOfJoining || "");
  setDepartment(selectedRow.department || "");
  setDesignation(selectedRow.designation || "");
  setManagerId(selectedRow.manager?.id?.toString() || "");
  setOpenModal(true);
  handleMenuClose();
}}>
  📝 Edit
</MenuItem>

<MenuItem onClick={() => {
  handleDeleteUser(selectedRow.id);
  handleMenuClose();
}}>
  🗑️ Delete
</MenuItem>

<MenuItem onClick={() => {
  setChangePasswordDialog(true);
  setSelectedRowEmail(selectedRow.emailId);
  handleMenuClose();
}}>
  🔐 Change Password
</MenuItem>

      </Menu>


      
   <Dialog

  open={openModal}
  onClose={() => {
    setOpenModal(false);
    resetForm(); // Optional: reset on close
  }}
  fullWidth
  maxWidth="md"
  PaperProps={{
    style: {
      backgroundColor: darkMode ? "#1A1A2E" : "#fff",
      color: darkMode ? "#ffffff" : "#000000",
    },
  }}
>
  <DialogTitle sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>
    {isEditMode ? "Edit User" : "Register User"}
  </DialogTitle>

  <DialogContent dividers>
    <Grid container spacing={2}>
      {[
        {
          label: "Enter First Name",
          value: firstName,
          setter: setFirstName,
          name: "firstName",
        },
        {
          label: "Enter Last Name",
          value: lastName,
          setter: setLastName,
          name: "lastName",
        },
        {
          label: "Enter Contact Number",
          value: mobileNumber,
          setter: setMobileNumber,
          name: "mobileNumber",
        },
        {
          label: "Enter Email",
          value: emailId,
          setter: setEmailId,
          name: "emailId",
        },
       
      ].map((field, index) => (
        <Grid item xs={6} key={index}>
          <TextField
            fullWidth
            label={field.label}
            value={field.value}
            onChange={(e) => field.setter(e.target.value)}
            InputLabelProps={{ style: { color: darkMode ? "#fff" : "#000" } }}
            InputProps={{
              style: {
                color: darkMode ? "#fff" : "#000",
              },
            }}
          />
        </Grid>
      ))}
{
  !isEditMode && (
    <Grid item xs={6}>
      <TextField
        fullWidth
        label="Enter Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        InputLabelProps={{ style: { color: darkMode ? "#fff" : "#000" } }}
        InputProps={{ style: { color: darkMode ? "#fff" : "#000" } }}
      />
    </Grid>
  )
}

      <Grid item xs={6}>
        <TextField
          select
          fullWidth
          label="Select Role"
          value={selectedRoleId}
          onChange={(e) => setSelectedRoleId(e.target.value)}
          SelectProps={{
            MenuProps: {
              PaperProps: {
                style: {
                  backgroundColor: darkMode ? "#2A2D50" : "#fff",
                  color: darkMode ? "#fff" : "#000",
                },
              },
            },
          }}
          InputLabelProps={{
            style: { color: darkMode ? "#fff" : "#000" },
          }}
          InputProps={{
            style: {
              color: darkMode ? "#fff" : "#000",
            },
          }}
        >
          {roles.map((role) => (
            <MenuItem key={role.roleId} value={role.roleId}>
              {role.roleName}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item xs={6}>
  <TextField
    label="Date of Joining"
    type="date"
    value={dateOfJoining}
    onChange={(e) => setDateOfJoining(e.target.value)}
    InputLabelProps={{ shrink: true, style: { color: darkMode ? "#fff" : "#000" } }}
    InputProps={{ style: { color: darkMode ? "#fff" : "#000" } }}
    fullWidth
  />
</Grid>

<Grid item xs={6}>
  <TextField
    label="Department"
    value={department}
    onChange={(e) => setDepartment(e.target.value)}
    InputLabelProps={{ style: { color: darkMode ? "#fff" : "#000" } }}
    InputProps={{ style: { color: darkMode ? "#fff" : "#000" } }}
    fullWidth
  />
</Grid>

<Grid item xs={6}>
  <TextField
    label="Designation"
    value={designation}
    onChange={(e) => setDesignation(e.target.value)}
    InputLabelProps={{ style: { color: darkMode ? "#fff" : "#000" } }}
    InputProps={{ style: { color: darkMode ? "#fff" : "#000" } }}
    fullWidth
  />
</Grid>

<Grid item xs={6}>
  <TextField
    select
    label="Select Manager"
    value={managerId}
    onChange={(e) => setManagerId(e.target.value)}
    fullWidth
    SelectProps={{
      MenuProps: {
        PaperProps: {
          style: {
            backgroundColor: darkMode ? "#2A2D50" : "#fff",
            color: darkMode ? "#fff" : "#000",
          },
        },
      },
    }}
    InputLabelProps={{ style: { color: darkMode ? "#fff" : "#000" } }}
    InputProps={{ style: { color: darkMode ? "#fff" : "#000" } }}
   
  >
    {loadingUsers ? (
      <MenuItem disabled>Loading...</MenuItem>
    ) : (
      userData.map((user) => (
        <MenuItem key={user.id} value={user.id}>
          {user.firstName} {user.lastName}
        </MenuItem>
      ))
    )}
  </TextField>
</Grid>

<Grid item xs={6}>
  <TextField
    select
    label="Select Hr Manager"
    value={hrManagerId}
    onChange={(e) => setHrManagerId(e.target.value)}
    fullWidth
    SelectProps={{
      MenuProps: {
        PaperProps: {
          style: {
            backgroundColor: darkMode ? "#2A2D50" : "#fff",
            color: darkMode ? "#fff" : "#000",
          },
        },
      },
    }}
    InputLabelProps={{ style: { color: darkMode ? "#fff" : "#000" } }}
    InputProps={{ style: { color: darkMode ? "#fff" : "#000" } }}
   
  >
    {loadingUsers ? (
      <MenuItem disabled>Loading...</MenuItem>
    ) : (
      userData.map((user) => (
        <MenuItem key={user.id} value={user.id}>
          {user.firstName} {user.lastName}
        </MenuItem>
      ))
    )}
  </TextField>
</Grid>

    </Grid>
  </DialogContent>

  <DialogActions>
    <Button
      variant="contained"
      onClick={() => {
        setOpenModal(false);
        resetForm(); // Clear on cancel
      }}
      sx={{
        backgroundColor: darkMode ? "#444" : "#ccc",
        color: darkMode ? "#fff" : "#000",
      }}
    >
      Close
    </Button>
    <Button
      variant="contained"
      onClick={handleRegisterUser}
      sx={{ backgroundColor: "#D63384", color: "#fff" }}
    >
      {isEditMode ? "Update" : "Save"}
    </Button>
  </DialogActions>
</Dialog>
<Dialog
  open={changePasswordDialog}
  onClose={() => setChangePasswordDialog(false)}
>
  <DialogTitle>Change Password</DialogTitle>
  <DialogContent dividers>
    <TextField
      label="Email"
      value={selectedRowEmail}
      fullWidth
      // disabled
      margin="dense"
    />
  
    <TextField
      label="New Password"
      type="password"
      value={newPassword}
      onChange={(e) => setNewPassword(e.target.value)}
      fullWidth
      margin="dense"
    />
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setChangePasswordDialog(false)}>Cancel</Button>
    <Button
      onClick={() => handleChangePassword()}
      variant="contained"
      color="primary"
    >
      Change
    </Button>
  </DialogActions>
</Dialog>

    </Box>
  );
};

export default User;
