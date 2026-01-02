import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardContent,
  Typography,
 
  Chip,
  Grid,
  Box,
  Paper,
  useTheme,
  alpha,
} from "@mui/material";
import { format } from "date-fns";
import {
    useGetAllEmployeeByManager,
  useGetLeaveRequestForManager,
  useGetStatsByManager,
  useUpdateLeaveRequestforAproved,
  useUpdateLeaveRequestforReject,
} from "./hook";

// Status color mapping
const statusColors = {
  APPROVED: "success",
  PENDING: "warning",
  REJECTED: "error",
};
const dashboardStats = {
  totalEmployees: 5,
  totalLeavesRequested: 2,
  totalLeavesApproved: 7,
  totalLeavesPending: 3,
  totalLeavesRejected: 2,
};

const AdminLeaveManagement = () => {
  const [users, setUsers] = useState([]);

  const theme = useTheme();
  const [userId, setUserId] = useState(null);



  const { data, refetch } = useGetLeaveRequestForManager();
  const leaveReqData = data || [];
  const { mutate: UpdateLeaveRequestforAproved } =
    useUpdateLeaveRequestforAproved();

  const { mutate: UpdateLeaveRequestforReject } =
    useUpdateLeaveRequestforReject();

  const { data:TotalEmployees } =  useGetAllEmployeeByManager(userId)

  const { data:statsdata } =  useGetStatsByManager()
 const stats = statsdata?.data || [];
console.log("stats",stats);

  useEffect(() => {
    const userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
    if (userDetails) setUserId(userDetails?.id?.toString() || null);
  }, []);
  // Transform API data
  useEffect(() => {
    if (leaveReqData) {
      const transformedUsers = leaveReqData.map((item) => ({
        id: item.id,
        userId: item.user.id,
        name: `${item.user.firstName} ${item.user.lastName}`,
        email: item.user.emailId,
        monthlyPaidLeaves: 1,
        leaveBalance: item.user.totalLeaveBalance ,
        leavesTaken: 20 - item.user.totalLeaveBalance, // Assuming 20 is default
        totalLeaveDays: item.totalLeaveDays,
        from: item.startDate,
        to: item.endDate,
        type: item.leaveType || "N/A",
        status: item.status,
        reason: item.reason,
      }));
      setUsers(transformedUsers);
    }
  }, [leaveReqData]);

  // Approve function
  const handleApprove = (leaveId) => {
    console.log(`Approving Leave ID: ${leaveId} `);

    const onSuccess = () => {
      refetch();
    };
    UpdateLeaveRequestforAproved({ leaveId: leaveId }, { onSuccess });
  };

  // Reject function
  const handleReject = (leaveId) => {
    console.log(`Rejecting Leave ID: ${leaveId} `);
    const onSuccess = () => {
      refetch();
    };
    UpdateLeaveRequestforReject({ leaveId: leaveId }, { onSuccess });
  };

  return (
    <Box
      sx={{
        p: { xs: 0, sm: 4 },
        mx: "auto",
      }}
    >
      <Typography variant="h4" align="center" gutterBottom fontWeight="bold">
        Admin Leave Management
      </Typography>

      {/* Dashboard Summary Cards */}
      <Grid container spacing={2} mb={4} sx={{ mt: 2 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card
            elevation={3}
            sx={{
              bgcolor: alpha(theme.palette.primary.main, 0.3),
              color: theme.palette.mode === "light" ? "black" : "white",
            }}
          >
            <CardContent>
              <Typography variant="subtitle2">Total Employees</Typography>
              <Typography variant="h5" fontWeight="bold">
                {TotalEmployees?.data?.employeeCount||0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card
            elevation={3}
            sx={{
              bgcolor: alpha(theme.palette.warning.main, 0.3),
              color: theme.palette.mode === "light" ? "black" : "white",
            }}
          >
            <CardContent>
              <Typography variant="subtitle2">Pending Requests</Typography>
                 {stats&& (
              <Typography variant="h5" fontWeight="bold">
             {stats?.totalPendingRequests||0}
              </Typography>)}
            </CardContent>
          </Card>
        </Grid>
        {/* <Grid item xs={12} sm={6} md={3}>
          <Card
            elevation={3}
            sx={{
              bgcolor: alpha(theme.palette.secondary.main, 0.3),
              color: theme.palette.mode === "light" ? "black" : "white",
            }}
          >
            <CardContent>
              <Typography variant="subtitle2">Leaves Requested</Typography>
              <Typography variant="h5" fontWeight="bold">
                {dashboardStats.totalLeavesRequested}
              </Typography>
            </CardContent>
          </Card>
        </Grid> */}

        <Grid item xs={12} sm={6} md={4}>
          <Card
            elevation={3}
            sx={{
              bgcolor: alpha(theme.palette.success.main, 0.3),
              color: theme.palette.mode === "light" ? "black" : "white",
            }}
          >
            <CardContent>
              <Typography variant="subtitle2">Leaves Approved</Typography>
            {stats && (
  <Typography variant="h5" fontWeight="bold">
    {stats.totalApprovedRequests}
  </Typography>
)}

            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Users summary cards */}

      <Grid container direction="column" spacing={2} mb={4}>
        {users.map((user) => {
          const isLowBalance = user.leaveBalance <= 1;

          return (
            <Grid item key={user.id}>
              <Paper
                elevation={2}
                sx={{
                  px: 2,
                  py: 1.5,
                  bgcolor: "background.paper",
                  borderLeft: `5px solid ${
                    isLowBalance ? "#e53935" : "#43a047"
                  }`,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    boxShadow: 4,
                    backgroundColor: "action.hover",
                  },
                }}
              >
                <Grid
                  container
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  spacing={2}
                  wrap="nowrap"
                >
                  {/* Left: User Info */}
                  <Grid item xs={3}>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {user.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {user.email}
                    </Typography>
                  </Grid>

                  {/* Middle: Leave Summary */}
                  <Grid item xs={7}>
                    <Box display="flex" flexDirection="row" gap={4}>
                      <Typography variant="caption">
                        <strong>Monthly Paid:</strong> {user.monthlyPaidLeaves}
                      </Typography>
                      <Typography variant="caption">
                        <strong>Balance Leaves:</strong> {user.leaveBalance}
                      </Typography>
                      <Typography variant="caption">
                        <strong>Total Leave Days:</strong> {user.totalLeaveDays}
                      </Typography>
                      <Typography variant="caption">
                        <strong>From:</strong> <br />
                        {format(new Date(user.from), "yyyy-MM-dd")}{" "}
                      </Typography>
                      <Typography variant="caption">
                        <strong>To:</strong> <br />
                        {format(new Date(user.to), "yyyy-MM-dd")}
                      </Typography>

                      <Typography variant="caption">
                        <strong>Status:</strong>
                        <Chip
                          label={user.status}
                          color={statusColors[user.status]}
                          size="small"
                          sx={{ mt: 0.5 }}
                        />
                      </Typography>
                    </Box>
                  </Grid>

                  {/* Right: Latest Leave Info + Actions */}
                  <Grid
                    item
                    xs={5}
                    display="flex"
                    justifyContent="flex-end"
                    alignItems="center"
                    gap={2}
                  >
                    <>
                      <>
                        <Button
                          size="small"
                          color="success"
                          variant="contained"
                            disabled={user.status !== "PENDING"}
                          onClick={() => handleApprove(user.id)}
                        >
                          Approve
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          variant="outlined"
                            disabled={user.status !== "PENDING"}
                          onClick={() => handleReject(user.id)}
                        >
                          Reject
                        </Button>
                      </>
                    </>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default AdminLeaveManagement;
