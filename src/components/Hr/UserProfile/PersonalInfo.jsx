import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Typography,
  Grid,
} from "@mui/material";
import { PersonPinCircleOutlined } from "@mui/icons-material";

const PersonalInfo = () => {
  const [user, setUser] = useState({
    firstName: "",
    lastName:"",
    emailId: "",
    mobileNumber: "",
    spouseName: "",
  });

  useEffect(() => {
    const storedData = sessionStorage.getItem("userDetails");
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        setUser(parsed);
      } catch (err) {
        console.error("Error parsing userDetails from sessionStorage", err);
      }
    }
  }, []);

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Personal Information
      </Typography>

      {/* Profile Card */}
      <Card sx={{ bgcolor: "background.default", mt: 2 }}>
        <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar sx={{ width: 64, height: 64 }}>
          {user.firstName || user.lastName ? (
  <>
    {(user.firstName ? user.firstName[0] : "")}
  </>
) : (
  <PersonPinCircleOutlined />
)}

          </Avatar>
          <Box>
             <Typography>
  {user.firstName || user.lastName
    ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
    : "N/A"}
</Typography>
            <Typography color="text.secondary">{user.emailId}</Typography>
            <Typography color="text.secondary">{user.mobileNumber}</Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Details Card */}
      <Card sx={{ mt: 3, bgcolor: "background.default" }}>
        <CardHeader title="Contact Details" />
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle2">Name</Typography>
             <Typography>
  {user.firstName || user.lastName
    ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
    : "N/A"}
</Typography>

            </Grid>
            {/* <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle2">Spouse Name</Typography>
              <Typography>{user.spouseName || "N/A"}</Typography>
            </Grid> */}
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle2">Phone</Typography>
              <Typography>{user.mobileNumber || "N/A"}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle2">Email</Typography>
              <Typography>{user.emailId || "N/A"}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PersonalInfo;
