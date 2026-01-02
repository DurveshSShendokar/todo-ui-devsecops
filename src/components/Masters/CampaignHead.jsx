import React from "react";
import { Box, Typography } from "@mui/material";
import CampaignHeadForm from "./CampaignHeadForm";

const CampaignHead = ({ darkMode }) => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h4"
        sx={{
          mb: 3,
          fontWeight: "bold",
          color: darkMode ? "#ffffff" : "#000000",
        }}
      >
        Campaign Head Management
      </Typography>
      <CampaignHeadForm darkMode={darkMode} />
    </Box>
  );
};

export default CampaignHead;
