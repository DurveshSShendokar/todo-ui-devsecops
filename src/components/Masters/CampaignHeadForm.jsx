import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Switch,
  FormControlLabel,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Modal,
  Stack,
  TablePagination,
} from "@mui/material";
import { Edit, Delete, Visibility, Close, GetApp } from "@mui/icons-material";
import { API_BASE_URL } from "../../utils/apiClient";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";


const BASE_URL = `${API_BASE_URL}/campaignHead`;

const CampaignHeadForm = ({ darkMode }) => {
  const [formData, setFormData] = useState({
    campaignName: "",
    description: "",
    isActive: false,
    activities: [],
  });

  const [campaigns, setCampaigns] = useState([]);
  const [editData, setEditData] = useState(null);
  const [viewData, setViewData] = useState(null);
  const [modalType, setModalType] = useState(""); // "edit" or "view"
  const [modalOpen, setModalOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
const [isEditing, setIsEditing] = useState(false);
const [editId, setEditId] = useState(null);


  // Fetch campaigns on mount
  useEffect(() => {
    fetchCampaigns();
  }, []);

  // Fetch all campaigns from API
  const fetchCampaigns = async () => {
    try {
      const response = await fetch(`${BASE_URL}/getAllCampaignHeadList`);
      if (response.ok) {
        const data = await response.json();
        setCampaigns(data);
      } else {
        console.error("Error fetching campaigns");
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const exportToExcel = () => {
    const exportData = campaigns.map(({ id, campaignName, description, isActive }) => ({
      ID: id,
      "Campaign Name": campaignName,
      Description: description,
      "Active Status": isActive ? "Active" : "Inactive",
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Campaign Heads");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const fileData = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(fileData, "CampaignHeads.xlsx");
  };

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle switch toggle
  const handleToggle = (e) => {
    setFormData({ ...formData, isActive: e.target.checked });
  };

  // Handle form submission (Add)
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const response = await fetch(`${BASE_URL}/addCampaignHead`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(formData),
  //     });

  //     if (response.ok) {
  //       alert("Campaign added successfully!");
  //       setFormData({ campaignName: "", description: "", isActive: false, activities: [] });
  //       fetchCampaigns();
  //     } else {
  //       alert("Something went wrong.");
  //     }
  //   } catch (error) {
  //     console.error("Error:", error);
  //   }
  // };
  const handleToggleActive = async (id, isActive) => {
    try {
      const response = await fetch(`${BASE_URL}/toggleCampaignActive/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        // Update the local UI immediately
        setCampaigns((prevCampaigns) =>
          prevCampaigns.map((campaign) =>
            campaign.id === id ? { ...campaign, isActive: !isActive } : campaign
          )
        );
      } else {
        alert("Failed to update active status.");
      }
    } catch (error) {
      console.error("Error updating active status:", error);
    }
  };
  // Handle Update (Modal Submit)
  const handleUpdate = async () => {
    if (!editData) return;

    try {
      const response = await fetch(`${BASE_URL}/updateCampaignHead/${editData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaignName: editData.campaignName,  // ✅ Now sending campaignName
          description: editData.description,   // ✅ Sending description
        }),
      });

      if (response.ok) {
        alert("Campaign updated successfully!");
        setModalOpen(false);
        fetchCampaigns(); // Refresh list after update
      } else {
        alert("Update failed.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Handle Delete Campaign
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/deleteCampaignHead/${id}`, { method: "DELETE" });

      if (response.ok) {
        alert("Campaign deleted successfully!");
        fetchCampaigns();
      } else {
        alert("Failed to delete.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Handle Edit (Open Modal)
const handleEdit = (campaign) => {
  setFormData({
    campaignName: campaign.campaignName,
    description: campaign.description,
    isActive: campaign.isActive,
    activities: campaign.activities || [],
  });
  setIsEditing(true);
  setEditId(campaign.id);
  setModalType("form");
  setModalOpen(true);
};



const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const url = isEditing
      ? `${BASE_URL}/updateCampaignHead/${editId}`
      : `${BASE_URL}/addCampaignHead`;
    const method = isEditing ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      alert(`Campaign ${isEditing ? "updated" : "added"} successfully!`);
      setFormData({ campaignName: "", description: "", isActive: false, activities: [] });
      setIsEditing(false);
      setEditId(null);
      fetchCampaigns();
          setModalOpen(false);
    } else {
      alert("Something went wrong.");
    }
  } catch (error) {
    console.error("Error:", error);
  }
};


  // Handle View (Open Modal)
  const handleView = (campaign) => {
    setViewData(campaign);
    setModalType("view");
    setModalOpen(true);
  };

  return (
      <Box sx={{ p: 3 }}>
     

 <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>

<Button
  variant="contained"
  onClick={() => {
    setFormData({ campaignName: "", description: "", isActive: false, activities: [] });
    setIsEditing(false);
    setEditId(null);
    setModalType("form");
    setModalOpen(true);
  }}
>
  Add New Campaign Head
</Button>
    <Typography variant="h6" sx={{ textAlign: "center", mb: 2, fontWeight: "bold" }}>
          Campaign Head List
        </Typography>

  <Button
        variant="contained"
        color="success"
        onClick={exportToExcel}
        startIcon={<GetApp />}
        sx={{ mb: 2 }}
      > 
        Export to Excel
      </Button>
</Box>



        {/* Campaign List Table */}
      <TableContainer component={Paper} sx={{ mt: 3, width: "100%" }}>
        <Table>
          <TableHead>
                <TableRow sx={{ backgroundColor: darkMode ? "#333" : "#e3f2fd"  }}>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Active</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {campaigns.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((campaign) => (
              <TableRow key={campaign.id}>
                <TableCell>{campaign.campaignName}</TableCell>
                <TableCell>{campaign.description}</TableCell>
                <TableCell>
                  <Switch
                    checked={campaign.isActive}
                    onChange={() => handleToggleActive(campaign.id, campaign.isActive)}
                  />
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <IconButton onClick={() => handleView(campaign)}><Visibility /></IconButton>
                    <IconButton onClick={() => handleEdit(campaign)}><Edit /></IconButton>
                    <IconButton onClick={() => handleDelete(campaign.id)} color="error"><Delete /></IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>


  <TablePagination
          component="div"
          count={campaigns.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />

      {/* View / Edit Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
  <Box
    sx={{
      p: 3,
      backgroundColor: darkMode ? "#444" : "#fff",
      borderRadius: 2,
      maxWidth: 600,
      width: "90%",
      margin: "auto",
      mt: 20,
    }}
  >
    {modalType === "view" && viewData ? (
      <>
        <Typography variant="h6" mb={2}>
          Campaign Details
        </Typography>
        <Typography>
          <strong>Name:</strong> {viewData.campaignName}
        </Typography>
        <Typography>
          <strong>Description:</strong> {viewData.description}
        </Typography>
        <Typography>
          <strong>Active:</strong> {viewData.isActive ? "Yes" : "No"}
        </Typography>
        <Button
          onClick={() => setModalOpen(false)}
          sx={{ mt: 3 }}
          variant="contained"
          color="secondary"
          startIcon={<Close />}
        >
          Close
        </Button>
      </>
    ) : (
      <>
        <Typography variant="h6" mb={2}>
          {isEditing ? "Edit Campaign" : "Add New Campaign"}
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Campaign Name"
            name="campaignName"
            value={formData.campaignName}
            onChange={handleChange}
            sx={{ mb: 2 }}
            required
          />
          <TextField
            fullWidth
            label="Description"
            name="description"
            multiline
            rows={3}
            value={formData.description}
            onChange={handleChange}
            sx={{ mb: 2 }}
            required
          />
          <FormControlLabel
            control={
              <Switch
                checked={formData.isActive}
                onChange={(e) => handleToggle(e)}
              />
            }
            label="Active Campaign"
            sx={{ mb: 2 }}
          />
          <Stack direction="row" spacing={2}>
            <Button type="submit" variant="contained" fullWidth>
              {isEditing ? "Update Campaign" : "Submit"}
            </Button>
            <Button
              onClick={() => setModalOpen(false)}
              variant="outlined"
              color="error"
              fullWidth
            >
              Cancel
            </Button>
          </Stack>
        </form>
      </>
    )}
  </Box>
</Modal>

    </Box>
  );
};

export default CampaignHeadForm;
