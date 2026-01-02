










import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  Breadcrumbs,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  Grid,
} from "@mui/material";
import { AccessTime, Logout } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { usePreviousPath } from "../../../Context/BreadCrumbContext";
import AttendanceTable from "./Table";
import {
  useCheckIn,
  useCheckOut,
  useCreateApprovalRequest,
  useGetAttendanceUserAll,
  useGetPendingAprovalsForUser,
} from "./hook";
import AttendanceEditForm from "./attendanceForm";
import CustomModal from "../../common/customModal";

const Attendance = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const navigate = useNavigate();

  const { previousPath } = usePreviousPath();
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [userId, setUserId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [hasCheckedInToday, setHasCheckedInToday] = useState(false);
  const [hasCheckedOutToday, setHasCheckedOutToday] = useState(false);
  const { mutate: checkIn } = useCheckIn();
  const { mutate: checkOut } = useCheckOut();
  const [todaysEntry, setTodaysEntry] = useState();


  const createApprovalRequest = useCreateApprovalRequest();

  const { data, isLoading } = useGetAttendanceUserAll({
    userId,
    month: selectedMonth,
    year: selectedYear,
  });

  const { data: dataaa } = useGetPendingAprovalsForUser(userId, currentMonth, currentYear);
  const tableData = dataaa?.data || [];

  useEffect(() => {
    const userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
    if (userDetails) {
      setUserId(userDetails?.id?.toString() || null);
    }
  }, []);

  useEffect(() => {
    if (!data?.data || !userId) return;

    const todayStr = new Date().toISOString().split("T")[0];

  const todayEntry = data.data.find(
  (entry) =>
    entry.user.id === Number(userId) &&
    new Date(entry.date).toISOString().split("T")[0] === todayStr
);

if (todayEntry) {
  setTodaysEntry(todayEntry.id);
  setHasCheckedInToday(!!todayEntry?.inTime);
  setHasCheckedOutToday(!!todayEntry?.outTime);
} else {
  setTodaysEntry(null);
  setHasCheckedInToday(false);
  setHasCheckedOutToday(false);
}

  }, [data, userId]);

  const getCurrentTime = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const handleCheckIn = () => {
    const time = getCurrentTime();
    checkIn({ userId, inTime: time });
  };

  const handleCheckOut = () => {
    const time = getCurrentTime();
    checkOut({ todaysEntry, outTime: time });
  };

  const handleEditAttendance = (entry) => {
    setEditData(entry);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditData(null);
  };

  const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isPreviousPath = previousPath === "/dashboard/todo";

  const handleSubmit = (formData) => {
    const payload = {
      userId: userId,
      date: formData.date,
      inTime: formData.inTime,
      outTime: formData.outTime,
      status: formData.status,
    };

    createApprovalRequest.mutate(payload, {
      onSuccess: () => {
        handleCloseModal();
      },
    });
  };

  const formattedDate = currentDate.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <Box  sx={{ px: { xs: 2, sm: 4, md: 6 } ,  p: { xs: 0, sm: 4 },}}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold", fontSize: { xs: "1.5rem", sm: "2rem" }, textAlign: { xs: "center", sm: "left" } }}>
        Attendance Tracker
      </Typography>

      {isPreviousPath && (
        <Breadcrumbs aria-label="breadcrumb" className="mb-4" sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}>
          <p onClick={() => navigate(previousPath)} style={{ cursor: "pointer" }}>Todo Dashboard</p>
          <Typography color="text.primary">Attendance</Typography>
        </Breadcrumbs>
      )}

      <Box className="mb-10 mt-10 text-center" sx={{ textAlign: "center" }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
          Today is {formattedDate}
        </Typography>

        <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2, justifyContent: "center" }}>
          <Button variant="outlined" startIcon={<AccessTime />} disabled={hasCheckedInToday}
            onClick={handleCheckIn}
            sx={{ borderColor: "#1976D2", color: "#1976D2", fontWeight: 600, textTransform: "none", px: 4, width: { xs: "100%", sm: "auto" } }}>
            {hasCheckedInToday ? "Checked In" : "Check In"}
          </Button>

          <Button variant="outlined" startIcon={<Logout />} 
       disabled={!hasCheckedInToday || hasCheckedOutToday}
            onClick={handleCheckOut}
            sx={{ borderColor: "#D32F2F", color: "#D32F2F", fontWeight: 600, textTransform: "none", px: 4, width: { xs: "100%", sm: "auto" } }}>
            {hasCheckedOutToday ? "Checked Out" : "Check Out"}
          </Button>
        </Box>
      </Box>

     {/* === Pending Approvals Cards === */}
{tableData.length > 0 && (
  <Box sx={{ mb: 4 }}>
    <Typography variant="h6" sx={{ mb: 1, fontWeight: "bold"}} gutterBottom>
      Pending Approvals
    </Typography>

    <Grid container spacing={2}>
      {tableData.map((item) => (
        <Grid item xs={12} sm={6} md={4} key={item.id}>
          <Paper
            elevation={2}
            sx={(theme) => ({
              p: 1.5,
              borderLeft: `4px solid ${theme.palette.primary.main}`,
              backgroundColor:
                theme.palette.mode === "dark"
                  ? theme.palette.grey[900]
                  : "#f1f5ff",
              display: "flex",
              flexDirection: "column",
              gap: 0.5,
              minHeight: 120,
              justifyContent: "center",
            })}
          >
            <Typography variant="subtitle2" fontWeight="bold">
              {item.user?.firstName} {item.user?.lastName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Date: {new Date(item.date).toLocaleDateString()}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              In Time: {item.inTime || "Not available"}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Out Time: {item.outTime || "Not recorded"}
            </Typography>
            <Typography variant="caption" color="warning.main">
              Status: Pending
            </Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  </Box>
)}

      <Box display="flex" flexDirection={{ xs: "column", sm: "row" }} gap={2} mb={2}>
        <FormControl variant="outlined" size="small" sx={{ width: { xs: '100%', md: 200 } }}>
          <InputLabel>Month</InputLabel>
          <Select value={selectedMonth} onChange={(e) => setSelectedMonth(Number(e.target.value))} label="Month">
            {monthNames.map((name, index) => (
              <MenuItem key={index} value={index + 1}>{name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl variant="outlined" size="small" sx={{ width: { xs: '100%', md: 200 } }}>
          <InputLabel>Year</InputLabel>
          <Select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))} label="Year">
            {years.map((year) => (
              <MenuItem key={year} value={year}>{year}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Paper elevation={3} className="overflow-auto rounded-lg">
        <AttendanceTable
          userId={userId}
          month={selectedMonth}
          year={selectedYear}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          onEdit={handleEditAttendance}
          onRowCheckIn={handleCheckIn}
          onRowCheckOut={handleCheckOut}
        />
      </Paper>

      <CustomModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        dialogTitle="Update Attendance"
        dialogDescription={`Update details for ${editData?.date}`}
        formId="edit-attendance-form"
      >
        <AttendanceEditForm
          formId="edit-attendance-form"
          initialData={editData}
          onSubmit={handleSubmit}
        />
      </CustomModal>
    </Box>
  );
};

export default Attendance;
