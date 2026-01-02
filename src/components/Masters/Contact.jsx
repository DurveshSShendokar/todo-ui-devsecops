import React from "react";
import { Box, Typography } from "@mui/material";
import ContactForm from "./ContactForm";

const Contact = ({ darkMode }) => {
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
        Contact Management
      </Typography>
      <ContactForm darkMode={darkMode} />
    </Box>
  );
};

export default Contact;
