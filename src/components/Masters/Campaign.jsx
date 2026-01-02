// import React, { useEffect, useState } from "react";
// import {
//   Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
//   IconButton, Modal, Paper, TextField, Button, TablePagination
// } from "@mui/material";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import FileDownloadIcon from "@mui/icons-material/FileDownload";
// import CampaignForm from "./CampaignForm";
// import { getAllCampaigns, deleteCampaign, updateCampaign } from "../../Services/CampaignService";
// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";

// const Campaign = ({ darkMode }) => {
//   const [campaigns, setCampaigns] = useState([]);
//   const [openModal, setOpenModal] = useState(false);
//   const [selectedCampaign, setSelectedCampaign] = useState(null);
//   const [editMode, setEditMode] = useState(false);
//   const [formData, setFormData] = useState({ name: "", description: "" });

//   // ✅ Pagination State
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);

//   useEffect(() => {
//     loadCampaigns();
//   }, []);

//   const loadCampaigns = async () => {
//     try {
//       const data = await getAllCampaigns();
//       setCampaigns(data);
//     } catch (error) {
//       console.error("Error fetching campaigns:", error);
//     }
//   };

//   const handleCampaignAdded = () => {
//     loadCampaigns();
//   };

//   const handleOpenModal = (campaign, isEdit = false) => {
//     setSelectedCampaign(campaign);
//     setOpenModal(true);
//     setEditMode(isEdit);
//     if (isEdit) {
//       setFormData({ name: campaign.name, description: campaign.description });
//     }
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure you want to delete this campaign?")) {
//       try {
//         await deleteCampaign(id);
//         loadCampaigns();
//       } catch (error) {
//         console.error("Error deleting campaign:", error);
//       }
//     }
//   };

//   const handleUpdate = async () => {
//     try {
//       await updateCampaign(selectedCampaign.id, formData);
//       setOpenModal(false);
//       loadCampaigns();
//     } catch (error) {
//       console.error("Error updating campaign:", error);
//     }
//   };

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   // ✅ Handle Pagination Change
//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   // ✅ Export to Excel
//   const handleExportExcel = () => {
//     const worksheet = XLSX.utils.json_to_sheet(campaigns);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Campaigns");
//     const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
//     const data = new Blob([excelBuffer], { type: "application/octet-stream" });
//     saveAs(data, "Campaigns.xlsx");
//   };

//   return (
//     <Box sx={{ p: 3 }}>
//       <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold", color: darkMode ? "#ffffff" : "#000000" }}>
//         Campaign Management
//       </Typography>

//       {/* Add Campaign Form */}
//       <CampaignForm darkMode={darkMode} onCampaignAdded={handleCampaignAdded} />

//       {/* Campaign List */}
//       <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 4 }}>
//         <Typography variant="h6" sx={{ color: darkMode ? "#ffffff" : "#000000" }}>
//           Campaign List
//         </Typography>
//         <Button variant="contained" color="success" startIcon={<FileDownloadIcon />} onClick={handleExportExcel}>
//           Export to Excel
//         </Button>
//       </Box>

//       <TableContainer sx={{ mt: 2 }}>
//         <Table sx={{ minWidth: 600, backgroundColor: darkMode ? "#424242" : "#ffffff" }}>
//           <TableHead>
//               <TableRow sx={{ backgroundColor: darkMode ? "#333" : "#e3f2fd"  }}>
//               <TableCell sx={{ fontWeight: "bold", color: darkMode ? "#ffffff" : "#000000" }}>Campaign Name</TableCell>
//               <TableCell sx={{ fontWeight: "bold", color: darkMode ? "#ffffff" : "#000000" }}>Description</TableCell>
//               <TableCell sx={{ fontWeight: "bold", color: darkMode ? "#ffffff" : "#000000" }}>Actions</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {campaigns.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((campaign) => (
//               <TableRow key={campaign.id}>
//                 <TableCell sx={{ color: darkMode ? "#ffffff" : "#000000" }}>{campaign.name}</TableCell>
//                 <TableCell sx={{ color: darkMode ? "#ffffff" : "#000000" }}>{campaign.description}</TableCell>
//                 <TableCell>
//                   <IconButton color="primary" onClick={() => handleOpenModal(campaign, false)}>
//                     <VisibilityIcon />
//                   </IconButton>
//                   <IconButton color="warning" onClick={() => handleOpenModal(campaign, true)}>
//                     <EditIcon />
//                   </IconButton>
//                   <IconButton color="error" onClick={() => handleDelete(campaign.id)}>
//                     <DeleteIcon />
//                   </IconButton>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       {/* ✅ Pagination Controls */}
//       <TablePagination
//         rowsPerPageOptions={[5, 10, 20]}
//         component="div"
//         count={campaigns.length}
//         rowsPerPage={rowsPerPage}
//         page={page}
//         onPageChange={handleChangePage}
//         onRowsPerPageChange={handleChangeRowsPerPage}
//       />

//       {/* ✅ Modal for Viewing/Editing Campaign Details */}
//       <Modal open={openModal} onClose={() => setOpenModal(false)}>
//         <Box
//           sx={{
//             position: "absolute",
//             top: "50%",
//             left: "50%",
//             transform: "translate(-50%, -50%)",
//             width: 400,
//             bgcolor: darkMode ? "#333" : "white",
//             boxShadow: 24,
//             p: 4,
//             borderRadius: 2
//           }}
//         >
//           <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
//             {editMode ? "Edit Campaign" : "Campaign Details"}
//           </Typography>

//           {selectedCampaign && !editMode && (
//             <>
//               <Typography><strong>ID:</strong> {selectedCampaign.id}</Typography>
//               <Typography><strong>Name:</strong> {selectedCampaign.name}</Typography>
//               <Typography><strong>Description:</strong> {selectedCampaign.description}</Typography>
//             </>
//           )}

//           {editMode && (
//             <form>
//               <TextField fullWidth label="Name" name="name" value={formData.name} onChange={handleChange} sx={{ mb: 2 }} required />
//               <TextField fullWidth label="Description" name="description" value={formData.description} onChange={handleChange} multiline rows={3} sx={{ mb: 2 }} required />
//               <Button variant="contained" fullWidth onClick={handleUpdate}>
//                 Update
//               </Button>
//             </form>
//           )}
//         </Box>
//       </Modal>

      
//     </Box>
//   );
// };

// export default Campaign;



import React, { useEffect, useState } from "react";
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Paper, TextField, Button, TablePagination,
  FormControl,
  InputLabel,
  MenuItem,
  Select
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { getAllCampaigns, deleteCampaign, updateCampaign, addCampaign } from "../../Services/CampaignService";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import ReusableModal from "../common/ReusableModal";
import { getAllProducts } from "../../Services/ProductService";

const Campaign = ({ darkMode }) => {
  const [campaigns, setCampaigns] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "" });
 const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    loadCampaigns();
    fetchProducts();
  }, []);

  const loadCampaigns = async () => {
    try {
      const data = await getAllCampaigns();
      setCampaigns(data);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    }
  };

  const handleOpenModal = (campaign = null, isEdit = false) => {
    setEditMode(isEdit);
    setSelectedCampaign(campaign);
    setFormData(
      campaign && isEdit
        ? { name: campaign.name, description: campaign.description }
        : { name: "", description: "" }
    );
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setFormData({ name: "", description: "" });
    setSelectedCampaign(null);
  };

  const handleSubmit = async () => {
    try {
      if (editMode && selectedCampaign) {
        await updateCampaign(selectedCampaign.id, formData);
      } else {
        await addCampaign(formData);
      }
      handleCloseModal();
      loadCampaigns();
    } catch (error) {
      console.error("Error submitting campaign:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this campaign?")) {
      try {
        await deleteCampaign(id);
        loadCampaigns();
      } catch (error) {
        console.error("Error deleting campaign:", error);
      }
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

   const fetchProducts = async () => {
      try {
        const data = await getAllProducts();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };


  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(campaigns);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Campaigns");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "Campaigns.xlsx");
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold", color: darkMode ? "#fff" : "#000" }}>
        Campaign Management
      </Typography>

  

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 4 }}>
            <Button variant="contained" onClick={() => handleOpenModal()}>
        Add Campaign
      </Button>
        <Typography variant="h6" sx={{ color: darkMode ? "#fff" : "#000" }}>
          Campaign List
        </Typography>
        <Button variant="contained" color="success" startIcon={<FileDownloadIcon />} onClick={handleExportExcel}>
          Export to Excel
        </Button>
      </Box>

      <TableContainer sx={{ mt: 2 }}>
        <Table sx={{ minWidth: 600, backgroundColor: darkMode ? "#424242" : "#fff" }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: darkMode ? "#333" : "#e3f2fd" }}>
              <TableCell sx={{ fontWeight: "bold", color: darkMode ? "#fff" : "#000" }}>Campaign Name</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: darkMode ? "#fff" : "#000" }}>Description</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: darkMode ? "#fff" : "#000" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {campaigns.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((campaign) => (
              <TableRow key={campaign.id}>
                <TableCell sx={{ color: darkMode ? "#fff" : "#000" }}>{campaign.name}</TableCell>
                <TableCell sx={{ color: darkMode ? "#fff" : "#000" }}>{campaign.description}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleOpenModal(campaign, false)}>
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton color="warning" onClick={() => handleOpenModal(campaign, true)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(campaign.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 20]}
        component="div"
        count={campaigns.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(e, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
      />

      {/* ✅ Reusable Modal */}
      <ReusableModal
        open={openModal}
        onClose={handleCloseModal}
        title={editMode ? 'Edit Campaign' : selectedCampaign ? 'Campaign Details' : 'Add Campaign'}
        onSubmit={editMode || !selectedCampaign ? handleSubmit : null}
        submitLabel={editMode ? 'Update' : 'Add'}
        showSubmitButton={editMode || !selectedCampaign}
      >
        {selectedCampaign && !editMode ? (
          <>
            <Typography><strong>ID:</strong> {selectedCampaign.id}</Typography>
            <Typography><strong>Name:</strong> {selectedCampaign.name}</Typography>
            <Typography><strong>Description:</strong> {selectedCampaign.description}</Typography>
          </>
        ) : (
          <>
          <div className="flex gap-4"> <TextField
              label="Campaign Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              fullWidth
              margin="normal"
            /></div>
           
                <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel>Product</InputLabel>
                      <Select name="productId" value={formData.productId} onChange={handleChange} required>
                        {products.map((product) => (
                          <MenuItem key={product.id} value={product.id}>
                            {product.productName}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
          </>
        )}
      </ReusableModal>
    </Box>
  );
};

export default Campaign;
