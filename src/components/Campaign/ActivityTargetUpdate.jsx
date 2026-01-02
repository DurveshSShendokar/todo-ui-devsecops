// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Typography,
//   Select,
//   MenuItem,
//   FormControl,
//   InputLabel,
//   Paper,
//   TextField,
//   Button,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
// } from "@mui/material";
// import { API_BASE_URL } from "../../utils/apiClient";
// const BASE_URL = `${API_BASE_URL}/campaign`;

// const ActivityTargetUpdate = ({ darkMode }) => {
//   const [campaigns, setCampaigns] = useState([]);
//   const [selectedCampaign, setSelectedCampaign] = useState("");
//   const [campaignHeads, setCampaignHeads] = useState([]); // ✅ Store multiple campaign heads
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [duration, setDuration] = useState(0);
//   const [frequency, setFrequency] = useState("");
//   const [loading, setLoading] = useState(false);

//   const [scheduleDates, setScheduleDates] = useState([]);

//   // ✅ Fetch Campaigns on Load
//   useEffect(() => {
//     fetchCampaigns();
//   }, []);

//   // ✅ Fetch Campaigns from API
//   const fetchCampaigns = async () => {
//     try {
//       const response = await fetch(`${BASE_URL}/getAllCampaignList`);
//       if (!response.ok) {
//         throw new Error("Failed to fetch campaigns");
//       }
//       const data = await response.json();
//       setCampaigns(data);
//     } catch (error) {
//       console.error("Error fetching campaigns:", error);
//     }
//   };

//   // ✅ Fetch Campaign Head when a Campaign is selected
//   const fetchCampaignHead = async (campaignId) => {
//     try {
//       const response = await fetch(`${BASE_URL}/${campaignId}/campaign-head`);
//       if (!response.ok) {
//         throw new Error("Failed to fetch campaign head");
//       }
//       const data = await response.json();

//       // ✅ Add new campaign head while keeping previous ones
//       setCampaignHeads((prev) => [...prev, data.campaignHead]);
//     } catch (error) {
//       console.error("Error fetching campaign head:", error);
//     }
//   };

//   // ✅ Handle Campaign Selection
//   const handleCampaignChange = (event) => {
//     const campaignId = event.target.value;

//     // Check if campaign is already added
//     if (!campaignHeads.some((head) => head.id === campaignId)) {
//       setSelectedCampaign(campaignId);
//       fetchCampaignHead(campaignId);
//     }
//   };

//   // ✅ Handle Start & End Date Changes & Update Duration
//   const handleDateChange = (event, type) => {
//     const value = event.target.value;

//     if (type === "start") {
//       setStartDate(value);
//     } else {
//       setEndDate(value);
//     }

//     // ✅ Recalculate Duration Immediately
//     const newStartDate = type === "start" ? value : startDate;
//     const newEndDate = type === "end" ? value : endDate;

//     if (newStartDate && newEndDate) {
//       const start = new Date(newStartDate);
//       const end = new Date(newEndDate);

//       if (end >= start) {
//         const diffTime = end - start;
//         const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//         setDuration(diffDays);
//       } else {
//         setDuration(0);
//       }
//     }
//   };


//   // ✅ Handle Submit Button Click
//   const handleSubmit = async () => {
//     if (!selectedCampaign || !startDate || !endDate || !frequency) {
//       alert("Please fill all fields before submitting.");
//       return;
//     }

//     setLoading(true);
//     try {
//       const requestBody = {
//         startDate,
//         endDate,
//         frequency,
//       };

//       // ✅ Call Spring Boot API to set dates & frequency
//       const response = await fetch(`${BASE_URL}/${selectedCampaign}/set-dates-and-frequency`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(requestBody),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to update campaign dates and frequency.");
//       }

//       const data = await response.json();
//       alert("Campaign updated successfully!");

    
//       fetchCampaignHead(selectedCampaign);
//       setCampaignHeads((prev) => [
//         ...prev,
//         {
//           campaignHead: data.campaignHead,
//           scheduleDates: data.scheduleDates || [],
//         },
//       ]);

    
//       setStartDate("");
//       setEndDate("");
//       setDuration(0);
//       setFrequency("");

//     } catch (error) {
//       console.error("Error updating campaign:", error);
//       alert("An error occurred while submitting.");
//     } finally {
//       setLoading(false);
//     }
//   };


//   return (
//     <Box sx={{ p: 4, maxWidth: 600, mx: "auto" }}>
//       <Paper
//         sx={{
//           p: 4,
//           backgroundColor: darkMode ? "#333" : "#fff",
//           color: darkMode ? "#fff" : "#000",
//         }}
//       >
//         <Typography variant="h4" fontWeight="bold" textAlign="center">
//           Activity Target Update
//         </Typography>

//         {/* ✅ Campaign Name Dropdown */}
//         <FormControl fullWidth sx={{ mt: 3 }}>
//           <InputLabel>Select Campaign</InputLabel>
//           <Select value={selectedCampaign} onChange={handleCampaignChange} required>
//             {campaigns.length > 0 ? (
//               campaigns.map((campaign) => (
//                 <MenuItem key={campaign.id} value={campaign.id}>
//                   {campaign.name} {/* ✅ Show Campaign Name */}
//                 </MenuItem>
//               ))
//             ) : (
//               <MenuItem disabled>No Campaigns Available</MenuItem>
//             )}
//           </Select>
//         </FormControl>

//         {/* ✅ Start Date Input */}
//         <TextField
//           fullWidth
//           label="Start Date"
//           type="date"
//           InputLabelProps={{ shrink: true }}
//           value={startDate}
//           onChange={(e) => handleDateChange(e, "start")} // ✅ Call function here
//           sx={{ mt: 3 }}
//           required
//         />

//         {/* ✅ End Date Input */}
//         <TextField
//           fullWidth
//           label="End Date"
//           type="date"
//           InputLabelProps={{ shrink: true }}
//           value={endDate}
//           onChange={(e) => handleDateChange(e, "end")} // ✅ Call function here
//           sx={{ mt: 3 }}
//           required
//         />

//         {/* ✅ Duration (Calculated) */}
//         <TextField
//           fullWidth
//           label="Duration (Days)"
//           type="number"
//           value={duration}
//           InputProps={{ readOnly: true }}
//           sx={{ mt: 3 }}
//         />

//         {/* ✅ Frequency Dropdown */}
//         <FormControl fullWidth sx={{ mt: 3 }}>
//           <InputLabel>Select Frequency</InputLabel>
//           <Select value={frequency} onChange={(e) => setFrequency(e.target.value)} required>
//             <MenuItem value="DAILY">Daily</MenuItem>
//             <MenuItem value="WEEKLY">Weekly</MenuItem>
//             <MenuItem value="MONTHLY">Monthly</MenuItem>
//             <MenuItem value="YEARLY">Yearly</MenuItem>
//           </Select>
//         </FormControl>

//         {/* ✅ Submit Button */}
//         <Button fullWidth variant="contained" sx={{ mt: 3 }} onClick={handleSubmit} disabled={loading}>
//           {loading ? "Submitting..." : "Submit"}
//         </Button>
//       </Paper>

//       {/* ✅ Campaign Head Table Below the Form */}
//       {campaignHeads.length > 0 && (
//   <TableContainer component={Paper} sx={{ mt: 3 }}>
//     <Table>
//       <TableHead>
//         <TableRow sx={{ backgroundColor: "#e0e0e0" }}>
//           <TableCell sx={{ fontWeight: "bold" }}>Campaign Head</TableCell>
//           <TableCell sx={{ fontWeight: "bold" }}>Scheduled Dates</TableCell>
//         </TableRow>
//       </TableHead>
//       <TableBody>
//         {campaignHeads.map((head, index) => (
//           <TableRow key={index}>
//             <TableCell>{head.campaignHead}</TableCell> {/* ✅ Show Campaign Head */}
//             <TableCell>
//               {head.scheduleDates && head.scheduleDates.length > 0 
//                 ? head.scheduleDates.join(", ") 
//                 : "No Dates"} {/* ✅ Display Schedule Dates */}
//             </TableCell>
//           </TableRow>
//         ))}
//       </TableBody>
//     </Table>
//   </TableContainer>
// )}
//     </Box>
//   );
// };

// export default ActivityTargetUpdate;



import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
} from "@mui/material";
import { API_BASE_URL } from "../../utils/apiClient";

const BASE_URL = `${API_BASE_URL}/campaign`;

const ActivityTargetUpdate = ({ darkMode }) => {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState("");
  const [campaignHeads, setCampaignHeads] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [duration, setDuration] = useState(0);
  const [frequency, setFrequency] = useState("");
  const [loading, setLoading] = useState(false);

  const theme = useTheme(); // ✅ Theme hook

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const response = await fetch(`${BASE_URL}/getAllCampaignList`);
      if (!response.ok) throw new Error("Failed to fetch campaigns");
      const data = await response.json();
      setCampaigns(data);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    }
  };

  const fetchCampaignHead = async (campaignId) => {
    try {
      const response = await fetch(`${BASE_URL}/${campaignId}/campaign-head`);
      if (!response.ok) throw new Error("Failed to fetch campaign head");
      const data = await response.json();
      setCampaignHeads((prev) => [...prev, data.campaignHead]);
    } catch (error) {
      console.error("Error fetching campaign head:", error);
    }
  };

  const handleCampaignChange = (event) => {
    const campaignId = event.target.value;
    if (!campaignHeads.some((head) => head.id === campaignId)) {
      setSelectedCampaign(campaignId);
      fetchCampaignHead(campaignId);
    }
  };

  const handleDateChange = (event, type) => {
    const value = event.target.value;
    if (type === "start") setStartDate(value);
    else setEndDate(value);

    const newStart = type === "start" ? value : startDate;
    const newEnd = type === "end" ? value : endDate;

    if (newStart && newEnd) {
      const start = new Date(newStart);
      const end = new Date(newEnd);
      const diff = end - start;
      setDuration(diff >= 0 ? Math.ceil(diff / (1000 * 60 * 60 * 24)) : 0);
    }
  };

  const handleSubmit = async () => {
    if (!selectedCampaign || !startDate || !endDate || !frequency) {
      alert("Please fill all fields before submitting.");
      return;
    }

    setLoading(true);
    try {
      const body = { startDate, endDate, frequency };
      const res = await fetch(`${BASE_URL}/${selectedCampaign}/set-dates-and-frequency`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Failed to update campaign.");
      const data = await res.json();
      alert("Campaign updated successfully!");

      fetchCampaignHead(selectedCampaign);

      setCampaignHeads((prev) => [
        ...prev,
        {
          campaignHead: data.campaignHead,
          scheduleDates: data.scheduleDates || [],
        },
      ]);

      setStartDate("");
      setEndDate("");
      setDuration(0);
      setFrequency("");
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while submitting.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 4, maxWidth: 600, mx: "auto" }}>
      <Paper
        sx={{
          p: 4,
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
        }}
        elevation={3}
      >
        <Typography variant="h4" fontWeight="bold" textAlign="center" gutterBottom>
          Activity Target Update
        </Typography>

        <FormControl fullWidth sx={{ mt: 3 }}>
          <InputLabel>Select Campaign</InputLabel>
          <Select
            value={selectedCampaign}
            onChange={handleCampaignChange}
            label="Select Campaign"
          >
            {campaigns.length > 0 ? (
              campaigns.map((campaign) => (
                <MenuItem key={campaign.id} value={campaign.id}>
                  {campaign.name}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>No Campaigns Available</MenuItem>
            )}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label="Start Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={startDate}
          onChange={(e) => handleDateChange(e, "start")}
          sx={{ mt: 3 }}
        />

        <TextField
          fullWidth
          label="End Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={endDate}
          onChange={(e) => handleDateChange(e, "end")}
          sx={{ mt: 3 }}
        />

        <TextField
          fullWidth
          label="Duration (Days)"
          type="number"
          value={duration}
          InputProps={{ readOnly: true }}
          sx={{ mt: 3 }}
        />

        <FormControl fullWidth sx={{ mt: 3 }}>
          <InputLabel>Select Frequency</InputLabel>
          <Select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            label="Select Frequency"
          >
            <MenuItem value="DAILY">Daily</MenuItem>
            <MenuItem value="WEEKLY">Weekly</MenuItem>
            <MenuItem value="MONTHLY">Monthly</MenuItem>
            <MenuItem value="YEARLY">Yearly</MenuItem>
          </Select>
        </FormControl>

        <Button
          fullWidth
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          sx={{ mt: 3 }}
        >
          {loading ? "Submitting..." : "Submit"}
        </Button>
      </Paper>

      {campaignHeads.length > 0 && (
        <TableContainer
          component={Paper}
          sx={{ mt: 3, backgroundColor: theme.palette.background.paper }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Campaign Head</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Scheduled Dates</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {campaignHeads.map((head, index) => (
                <TableRow key={index}>
                  <TableCell>{head.campaignHead}</TableCell>
                  <TableCell>
                    {head.scheduleDates?.length > 0
                      ? head.scheduleDates.join(", ")
                      : "No Dates"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default ActivityTargetUpdate;
