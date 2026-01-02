
import React, { useState } from "react";
import {
  Box,
  Button,
  Switch,
  TextField,
  MenuItem,
  FormControlLabel,
  Typography,
  Paper,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import AutoAttendanceTable from "./autoAttendenceTable";
import CustomModal from "../../common/customModal";
import AutoAttendanceForm from "./autoAttendenceForm";
import {
  useCreateAutoAttendance,
  useCreateAutoAttendanceBulk,
  useGetUserAll,
  useUpdateAutoAttendanceUser,
  useUpdateAutoAttendanceUserBulk,
} from "./hook";
import AddAutoAttendanceForm from "./addAutoAttendanceForm";

const AutoAttendance = () => {
  const [viewMode, setViewMode] = useState("single"); // "single" or "multiple"
const theme = useTheme();
const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [userId, setUserId] = useState("");
  const [isActive, setIsActive] = useState(0);
  const [signInTime, setSignInTime] = useState("");
  const [editingEntry, setEditingEntry] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editUserId, setEditUserId] = useState();
  const [selectedAttendenaceIds, setSelectedAttendenaceIds] = useState([]);
  console.log("selectedAttendenaceIds", selectedAttendenaceIds);
const [outTime, setOutTime] = useState("");

  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

  const { data, isLoading } = useGetUserAll();
  const userData = data?.data || [];

  const createAutoAttendence = useCreateAutoAttendance();
  const updateAutoAttendanceUser = useUpdateAutoAttendanceUser(editUserId);
  const updateAutoAttendanceUserBulk = useUpdateAutoAttendanceUserBulk();
  const createAutoAttendenceBulk = useCreateAutoAttendanceBulk();

  const handleBulkSelect = (ids) => {
    setSelectedAttendenaceIds(ids); // Assume `ids` is an array like [1, 2, 3]
  };

  const handleEditOpenBulk = () => {
    setIsBulkModalOpen(true);
  };

  const handleSubmit = () => {
    if (!userId || !signInTime) {
      alert("Please select a user and time.");
      return;
    }

    const payload = {
      userId: Number(userId),
      isActive: isActive ? 1 : 0,
      signInTime: signInTime,
      outTime:outTime,
    };

    createAutoAttendence.mutate(payload);
  };

  const handleEdit = (entry) => {
    setEditUserId(entry.id);
    setEditingEntry(entry);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEntry(null);
  };

  const handleSingleSaveEdit = (payload) => {
   updateAutoAttendanceUser.mutate(payload, {
  onSuccess: () => {
    setIsModalOpen(false);
  },
});

  };

  const handleBulkFormSubmit = (formData) => {
  const { isActive, signInTime, outTime } = formData;

  if (selectedAttendenaceIds.length > 0) {
    updateAutoAttendanceUserBulk.mutate({
      autoIds: selectedAttendenaceIds,
      isActive,
      signInTime,
      outTime,
    });
  } else if (selectedUsers.length > 0) {
    createAutoAttendenceBulk.mutate({
      autoIds: selectedUsers,
      isActive,
      signInTime,
      outTime, 
    });
  }

  setIsBulkModalOpen(false);
  setSelectedUsers([]);
  setSelectedAttendenaceIds([]);
};

  const handleCloseBulkModal = () => {
    setIsBulkModalOpen(false);
    setSelectedUsers([]);
    setSelectedAttendenaceIds([]);
  };

  return (
    <Box p={2}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
        Auto Attendance Setup
      </Typography>

      {/* <Box display="flex" gap={2} mb={3}>
        <Button
          variant={viewMode === "single" ? "contained" : "outlined"}
          onClick={() => setViewMode("single")}
        >
          Add Single Auto Attendance
        </Button>
    
      </Box> */}

     {/* Single Auto Attendance */}
{viewMode === "single" && (
  <Paper sx={{ p: 3, mb: 4 }}>
    <Box
      display="flex"
      gap={3}
      alignItems="center"
      flexWrap="wrap"
      sx={{
        "& > *": {
          flexBasis: isMobile ? "100%" : "auto",
          minWidth: isMobile ? "100%" : "auto",
        },
      }}
    >
      <TextField
        select
        label="Select User"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        sx={{ minWidth: isMobile ? "100%" : 200 }}
      >
        {isLoading ? (
          <MenuItem disabled>Loading...</MenuItem>
        ) : (
          userData.map((user) => (
            <MenuItem key={user.id} value={user.id}>
              {user.firstName}-{user.lastName}
            </MenuItem>
          ))
        )}
      </TextField>

      <TextField
        type="time"
        label="Sign-In Time"
        value={signInTime}
        onChange={(e) => setSignInTime(e.target.value)}
        InputLabelProps={{ shrink: true }}
        sx={{ minWidth: isMobile ? "100%" : 150 }}
      />

      <TextField
        type="time"
        label="Out-Time"
        value={outTime}
        onChange={(e) => setOutTime(e.target.value)}
        InputLabelProps={{ shrink: true }}
        sx={{ minWidth: isMobile ? "100%" : 150 }}
      />

      <FormControlLabel
        control={
          <Switch
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
        }
        label="Is Active"
        sx={{ flexBasis: isMobile ? "100%" : "auto" }}
      />

      <Button
        variant="contained"
        onClick={handleSubmit}
        sx={{ flexBasis: isMobile ? "100%" : "auto" }}
      >
        Submit
      </Button>

      <Button
        variant="contained"
        onClick={() => setIsBulkModalOpen(true)}
        sx={{ flexBasis: isMobile ? "100%" : "auto" }}
      >
        Add Multiple Auto Attendance
      </Button>
    </Box>
  </Paper>
)}


      {/* Multiple Auto Attendance */}
      {/* {viewMode === "multiple" && (
        <UserListTable
          userData={userData}
          selectedUsers={selectedUsers}
          setSelectedUsers={setSelectedUsers}
          onAddClick={() => setIsBulkModalOpen(true)}
        />
      )} */}

      {/* Always visible: Auto Attendance List */}
      <div className="mt-4">
        {" "}
        <AutoAttendanceTable
          onEdit={handleEdit}
          onBulkSelect={handleBulkSelect}
          onEditClick={handleEditOpenBulk}
          
        />
      </div>

      {/*Single Edit Modal */}
      <CustomModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        dialogTitle="Update Auto Attendance"
        dialogDescription={`Update settings for ${
          editingEntry?.user?.firstName || ""
        }`}
        formId="auto-attendance-form"
      >
        <AutoAttendanceForm
          formId="auto-attendance-form"
          initialData={editingEntry}
          onSubmit={handleSingleSaveEdit}
        />
      </CustomModal>

      {/* Bulk Add Modal */}
      <CustomModal
        isOpen={isBulkModalOpen}
        onClose={handleCloseBulkModal}
        dialogTitle={
          selectedAttendenaceIds.length > 0
            ? "Edit Auto Attendance"
            : "Add Auto Attendance"
        }
        dialogDescription={`Set time and status for ${
          selectedAttendenaceIds.length || selectedUsers.length
        } users`}
        formId="auto-attendance-add"
      >
        <AddAutoAttendanceForm
          formId="auto-attendance-add"
          onSubmit={handleBulkFormSubmit}
            userData={userData}
            selectedAttendanceIds={selectedAttendenaceIds}
                selectedUsers={selectedUsers}
          setSelectedUsers={setSelectedUsers}
        />
      </CustomModal>
    </Box>
  );
};

export default AutoAttendance;
