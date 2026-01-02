import React, { useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Paper,
  Typography,
  Grid,
  useTheme,
  Divider,
} from "@mui/material";
import PersonalInfo from "./PersonalInfo";
import WorkInfo from "./WorkInfo";
import DocumentManager from "./Documents";

const UserProfile = ({ darkMode }) => {
  const [activeTab, setActiveTab] = useState(0);
  const theme = useTheme();

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const userDetails = JSON.parse(sessionStorage.getItem("userDetails")) || {};
  const userId = userDetails.id || "";


  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return (
          <Box p={3}>
            <PersonalInfo />
          </Box>
        );
      case 1:
        return (
          <Box p={3}>
            <WorkInfo darkMode={darkMode} />
          </Box>
        );
      case 2:
        return (
          <Box p={3}>
            <DocumentManager darkMode={darkMode} userId={userId} />
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ mt: 2, px: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <Paper
            elevation={2}
            sx={{
              borderRadius: 1,
              bgcolor: theme.palette.background.paper,
              minHeight: 610,
            }}
          >
            <Box
              sx={{
                textAlign: "center",
                p: 2, 
              }}
            >
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Profile
              </Typography>
              <Divider sx={{ mt: 1 }} />
            </Box>
            <Tabs
              orientation="vertical"
              variant="scrollable"
              value={activeTab}
              onChange={handleTabChange}
              aria-label="User profile tabs"
              sx={{ borderRight: 1, borderColor: "divider", p: 2 }}
            >
              <Tab label="Personal Information" />
              <Tab label="Work Information" />
              <Tab label="Documents" />
            </Tabs>
          </Paper>
        </Grid>

        <Grid item xs={12} md={9}>
          <Paper
            elevation={2}
            sx={{
              borderRadius: 1,
              bgcolor: theme.palette.background.paper,
              minHeight: 610,
            }}
          >
            {renderTabContent()}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserProfile;
