import React from "react";
import { Box, Typography } from "@mui/material";
import CompanyForm from "./CompanyForm";

const Company = ({ darkMode }) => {
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
        Company Management
      </Typography>
      <CompanyForm darkMode={darkMode} />
    </Box>
  );
};

export default Company;
