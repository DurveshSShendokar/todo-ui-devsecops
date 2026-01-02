import { useState } from "react";
import { Tabs, Tab, Box } from "@mui/material";
import Industry from "../Masters/Industry";
import IndustryMapping from "../Campaign/IndustryMapping";
import Contact from "../Masters/Contact";
import ContactMapping from "../Campaign/ContactMapping";

const ContactTabs = ({ darkMode }) => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ px: 2, py: 3 }}>
      <Box
        sx={{
          border: `1px solid ${darkMode ? "#444" : "#ccc"}`,
          borderRadius: 2,
          display: "inline-block",
          bgcolor: darkMode ? "#1e1e1e" : "#fafafa",
          px: 2,
        }}
      >
     <Tabs
  value={value}
  onChange={handleChange}
  variant="scrollable"
  scrollButtons="auto"
  textColor="primary"
  indicatorColor="primary"
  sx={{
    minHeight: 32, // Reduce overall tab bar height
    "& .MuiTab-root": {
      fontWeight: 500,
      textTransform: "capitalize",
      minWidth: "auto",
      px: 2,
      py: 0.5, // Reduced padding for height
      fontSize: 13, // Smaller text
      minHeight: 32, // Reduce tab height
      color: darkMode ? "#ddd" : "#444",
    },
    "& .Mui-selected": {
      color: darkMode ? "#90caf9" : "#1976d2",
    },
    "& .MuiTabs-indicator": {
      height: 2,
    },
  }}
>

          <Tab label="Contact" />
          <Tab label="Contact Mapping" />
        </Tabs>
      </Box>

      <Box sx={{ mt: 0 }}>
        {value === 0 && <Contact darkMode={darkMode} />}
        {value === 1 && <ContactMapping darkMode={darkMode} />}
      </Box>
    </Box>
  );
};

export default ContactTabs;
