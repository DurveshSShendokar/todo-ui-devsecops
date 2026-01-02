import React, { useState } from "react";
import { Tabs, Tab, Box } from "@mui/material";
import CampaignLeadStatus from "../Campaign/CampaignLeadStatus";
import MqlStatus from "../Campaign/MqlStatus";
import SqlStatus from "../Campaign/SqlStatus";
import DealClose from "../Campaign/DealClose";

const CampaignStatusTabs = ({ darkMode }) => {
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

          <Tab label="Lead Status" />
          <Tab label="MQL Status" />
          <Tab label="SQL Status" />
          <Tab label="Deal Close" />
        </Tabs>
      </Box>

      <Box sx={{ mt: 0 }}>
        {value === 0 && <CampaignLeadStatus darkMode={darkMode} />}
        {value === 1 && <MqlStatus darkMode={darkMode} />}
        {value === 2 && <SqlStatus darkMode={darkMode} />}
        {value === 3 && <DealClose darkMode={darkMode} />}
      </Box>
    </Box>
  );
};

export default CampaignStatusTabs;
