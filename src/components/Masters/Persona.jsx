import React from "react";
import { Box, Typography } from "@mui/material";
import PersonaForm from "./PersonaForm";

const Persona = ({ darkMode }) => {
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
        Persona Management
      </Typography>
      <PersonaForm darkMode={darkMode} />
    </Box>
  );
};

export default Persona;
