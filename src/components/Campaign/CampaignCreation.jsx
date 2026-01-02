import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
    TablePagination,
  
} from "@mui/material";
import { useTheme, useMediaQuery } from "@mui/material";
import CampaignTable from "./CampaignTable";
import axios from "axios";
import { getAllProducts } from "../../Services/ProductService";
import { API_BASE_URL } from "../../utils/apiClient";

const CampaignCreation = () => {
  const [products, setProducts] = useState([]);
  const [campaignHeads, setCampaignHeads] = useState([]); // Fetching Campaign Heads
  const [selectedProduct, setSelectedProduct] = useState("");
  const [campaignName, setCampaignName] = useState("");
  const [selectedCampaign, setSelectedCampaign] = useState("");
  const [campaignHeadTarget, setCampaignHeadTarget] = useState("");
  const [campaignSubheadTarget, setCampaignSubheadTarget] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [frequency, setFrequency] = useState("");
  const [selectedCampaignHeads, setSelectedCampaignHeads] = useState([]);
  const [selectedCampaigns, setSelectedCampaigns] = useState([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // ✅ Detect mobile screens
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  
  // ✅ Array

  

  const [campaigns, setCampaigns] = useState([]);
const [selectedCampaignId, setSelectedCampaignId] = useState("");
const [campaignList, setCampaignList] = useState([]);

  // User selects Daily/Weekly

  useEffect(() => {
    fetchProducts();
    fetchCampaignHeads();
    fetchAllCampaigns();
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/campaign/getAllCampaignList`);
      console.log(" Fetched Campaigns:", response.data); // ✅ Debug log
  
      if (response.status === 200 && Array.isArray(response.data)) {
        setCampaigns(response.data); // ✅ Store campaigns
      } else {
        console.error(" Unexpected response format:", response.data);
      }
    } catch (error) {
      console.error(" Error fetching campaigns:", error.response?.data || error.message);
    }
  };
  const fetchProducts = async () => {
    try {
      const data = await getAllProducts();
      setProducts(data);
    } catch (error) {
      console.error(" Error fetching products:", error.response?.data || error.message);
    }
  };

  const fetchCampaignHeads = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/campaignHead/getAllCampaignHeadList`);
      if (response.status === 200 && Array.isArray(response.data)) {
        setCampaignHeads(response.data); // ✅ Store campaign heads in state
      } else {
        console.error(" Unexpected response format:", response.data);
      }
    } catch (error) {
      console.error("Error fetching campaign heads:", error.response?.data || error.message);
    }
  };
  

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    console.log(" Selected Campaigns:", selectedCampaigns); 
  
    if (!selectedCampaign || selectedCampaign.length === 0) {
      alert(" Please select a campaign before submitting.");
      return;
    }
  
    const payload = {
      campaignId: selectedCampaign, 
      campaignHeadIds: selectedCampaignHeads.map((id) => parseInt(id, 10)),
      productId: parseInt(selectedProduct, 10),
      campaignHeadTarget: parseInt(campaignHeadTarget, 10) || 0,
      campaignSubheadTarget: parseInt(campaignSubheadTarget, 10) || 0,
      frequency,
      startDate,
      endDate,
    };
  
    console.log(" Sending Payload:", payload);
  
    try {
      const response = await axios.post(`${API_BASE_URL}/campaign-creation/create`, payload, {
        headers: { "Content-Type": "application/json" },
      });
  
      if (response.status === 200) {
        console.log("✅ Campaign Created Successfully:", response.data);
        alert("✅ Campaign Created Successfully!");
  
        setCampaigns((prev) => [
          ...prev,
          {
            id: response.data.campaignId,
            name: response.data.campaignName,
            productName: response.data.productName,
            startDate: response.data.startDate,
            endDate: response.data.endDate,
            frequency: response.data.frequency,
            campaignHeads: response.data.campaignHeads || [],
          },
        ]);
      }
    } catch (error) {
      console.error(" Error creating campaign:", error.response?.data || error.message);
      alert(" Failed to create campaign. Check console for details.");
    }
  };

  const fetchAllCampaigns = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/campaign-creation/all`);
      if (response.status === 200 && Array.isArray(response.data)) {
        setCampaignList(response.data); // ✅ Store data in state
      } else {
        console.error(" Unexpected response format:", response.data);
      }
    } catch (error) {
      console.error(" Error fetching campaigns:", error.response?.data || error.message);
    }
  };

  return (
    <>
    <Box
    sx={{
      p: isMobile ? 2 : 4, // ✅ Adjust padding dynamically
      maxWidth: isMobile ? "95%" : isTablet ? "80%" : "100%", // ✅ Adjust width based on screen
      mx: "auto", // ✅ Center content
      transition: "all 0.3s ease-in-out", // ✅ Smooth transition
    }}
  >
      <Paper
        elevation={isMobile ? 2 : 4} // ✅ Lower elevation for smaller screens
        sx={{
          p: isMobile ? 2 : 4,
          borderRadius: "12px",
          backgroundColor: theme.palette.mode === "dark" ? "#1e1e1e" : "#ffffff", // ✅ Dark mode support
          transition: "all 0.3s ease-in-out", // ✅ Smooth transition
        }}
      >
        <Typography variant="h4" fontWeight="bold" textAlign="center">
          Campaign Creation
        </Typography>

        <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-3 gap-4">

          {/* Campaign Name */}
          <FormControl fullWidth sx={{ mt: 3 }}>
  <InputLabel>Campaign</InputLabel>
  <Select
    value={selectedCampaign} // ✅ Single value instead of array
    onChange={(e) => {
      setSelectedCampaign(e.target.value); // ✅ Store only one campaign
      console.log("✅ Selected Campaign:", e.target.value);
    }}
    required
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

          {/* Product Dropdown */}
          <FormControl fullWidth sx={{ mt: 3 }}>
            <InputLabel>Product</InputLabel>
            <Select value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)} required>
              {products.map((product) => (
                <MenuItem key={product.id} value={product.id}>
                  {product.productName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Campaign Head Dropdown (Fetched from API) */}
          <FormControl fullWidth sx={{ mt: 3 }}>
  <InputLabel>Campaign Heads</InputLabel>
  <Select
    multiple
    value={selectedCampaignHeads}
    onChange={(e) => setSelectedCampaignHeads(e.target.value)}
    renderValue={(selected) =>
      selected
        .map((id) => campaignHeads.find((head) => head.id === id)?.campaignName)
        .join(", ")
    }
    required
  >
    {campaignHeads.length > 0 ? (
      campaignHeads.map((head) => (
        <MenuItem key={head.id} value={head.id}>
          <Checkbox checked={selectedCampaignHeads.includes(head.id)} />
          {head.campaignName} {/* ✅ Show campaign name */}
        </MenuItem>
      ))
    ) : (
      <MenuItem disabled>No Campaign Heads Available</MenuItem>
    )}
  </Select>
</FormControl>

          {/* Campaign Head Target */}
          <TextField
            fullWidth
            label="Campaign Head Target"
            type="number"
            value={campaignHeadTarget}
            onChange={(e) => setCampaignHeadTarget(e.target.value)}
            sx={{ mt: 2 }}
            required
          />

          {/* Campaign Subhead Target */}
          <TextField
            fullWidth
            label="Campaign Subhead Target"
            type="number"
            value={campaignSubheadTarget}
            onChange={(e) => setCampaignSubheadTarget(e.target.value)}
            sx={{ mt: 2 }}
            required
          />

          {/* Frequency Selection (Daily/Weekly) */}
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Frequency</InputLabel>
            <Select value={frequency} onChange={(e) => setFrequency(e.target.value)} required>
              <MenuItem value="DAILY">Daily</MenuItem>
              <MenuItem value="WEEKLY">Weekly</MenuItem>
            </Select>
          </FormControl>
</div>
          {/* Start and End Dates */}
          <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
            <TextField
              fullWidth
              label="Start Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
            <TextField
              fullWidth
              label="End Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </Box>

          {/* Submit Button */}
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3 }}>
            Submit
          </Button>
        </form>
  
        
      </Paper>
   
      
    </Box>
       {campaignList.length > 0 && <CampaignTable campaigns={campaignList} />}</>
  );
};


export default CampaignCreation;
