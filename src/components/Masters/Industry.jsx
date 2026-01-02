import React from "react";
import { Box, Typography } from "@mui/material";
import IndustryForm from "./IndustryForm";

const Industry = ({ darkMode }) => {
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
        Industry Management
      </Typography>
      <IndustryForm darkMode={darkMode} />
    </Box>
  );
};

export default Industry;
