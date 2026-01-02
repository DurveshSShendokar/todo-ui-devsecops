import React, { useState, useEffect } from "react";
import {
  Box, TextField, Button, Typography, Paper,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Modal, TablePagination
} from "@mui/material";
import { Visibility, Edit, Delete, Close, GetApp } from "@mui/icons-material";
import * as XLSX from "xlsx";
import { getAllIndustries, addIndustry, updateIndustry, deleteIndustry } from "../../Services/IndustryService";

const IndustryForm = ({darkMode}) => {
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [selectedProduct, setSelectedProduct] = useState("");  // Selected product
const [selectedIndustries, setSelectedIndustries] = useState([]); 
  const [industries, setIndustries] = useState([]);
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({ name: "", description: "" });

const [isFormOpen, setIsFormOpen] = useState(false);
const [isEditMode, setIsEditMode] = useState(false);
const [editingId, setEditingId] = useState(null);


const openAddForm = () => {
  setIsEditMode(false);
  setFormData({ name: "", description: "" });
  setIsFormOpen(true);
};

const openEditForm = (industry) => {
  setIsEditMode(true);
  setEditingId(industry.id);
  setFormData({ name: industry.name, description: industry.description });
  setIsFormOpen(true);
};


  // Pagination States
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    fetchIndustries();
  }, []);

  const fetchIndustries = async () => {
    try {
      const data = await getAllIndustries();
      setIndustries(data);
    } catch (error) {
      console.error("Error fetching industries:", error);
    }
  };
  const handleProductChange = async (event) => {
    const productId = event.target.value;
    setSelectedProduct(productId);

    try {
      const response = await axios.get(`${API_BASE_URL}/product/getProductWithIndustries/${productId}`);
      const industryIds = response.data.industries.map((industry) => industry.industryId);
      setSelectedIndustries(industryIds);
    } catch (error) {
      console.error("Error fetching industries for selected product:", error);
    }
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    if (isEditMode) {
      await updateIndustry(editingId, formData);
    } else {
      await addIndustry(formData);
    }

    fetchIndustries();
    setIsFormOpen(false);
    setFormData({ name: "", description: "" });
    setIsEditMode(false);
    setEditingId(null);
  } catch (error) {
    console.error("Error saving industry:", error);
  }
};


  const handleEditClick = (industry) => {
    setEditFormData({ name: industry.name, description: industry.description });
    setSelectedIndustry(industry);
    setIsEditModalOpen(true);
  };

  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  // const handleUpdate = async () => {
  //   if (!selectedIndustry) return;
  //   try {
  //     await updateIndustry(selectedIndustry.id, editFormData);
  //     fetchIndustries();
  //     setIsEditModalOpen(false);
  //   } catch (error) {
  //     console.error("Error updating industry:", error);
  //   }
  // };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this industry?")) {
      try {
        await deleteIndustry(id);
        fetchIndustries();
      } catch (error) {
        console.error("Error deleting industry:", error);
      }
    }
  };

  const handleOpenViewModal = (industry) => {
    setSelectedIndustry(industry);
    setIsViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedIndustry(null);
  };

  // Pagination Handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Export to Excel Function
  const handleExportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(industries);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Industries");
    XLSX.writeFile(workbook, "industries.xlsx");
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 0 }}>
    
      {/* <Paper elevation={3} sx={{ padding: 4, maxWidth: 500, width: "100%", mb: 4 }}>
        <Typography variant="h5" sx={{ textAlign: "center", mb: 2, fontWeight: "bold" }}>
          Add New Industry
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField fullWidth label="Name" name="name" variant="outlined" value={formData.name} onChange={handleChange} sx={{ mb: 2 }} required />
          <TextField fullWidth label="Description" name="description" variant="outlined" multiline rows={4} value={formData.description} onChange={handleChange} sx={{ mb: 2 }} required />
          <Button type="submit" variant="contained" fullWidth>
            Submit
          </Button>
        </form>
      </Paper> */}

      {/* Export Button */}
      

      {/* Industry List */}
      <Box sx={{ width: "100%" }}>
         <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 4 }}>
<Button variant="contained" onClick={openAddForm}>
  Add New Industry
</Button>
        <Typography variant="h6" sx={{ textAlign: "center", mb: 2, fontWeight: "bold" }}>
          Industry List
        </Typography>
           <Button
        variant="contained"
        color="success"
        onClick={handleExportToExcel}
        startIcon={<GetApp />}
        sx={{ mb: 2 }}
      >
        Export to Excel
      </Button></Box>
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 600, backgroundColor: darkMode ? "#424242" : "#ffffff" }}>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: darkMode ? "#333" :"#e3f2fd" }}>
             <TableCell sx={{ fontWeight: "bold", color: darkMode ? "#ffffff" : "#000000" }}>ID</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Description</TableCell>
              <TableCell sx={{ fontWeight: "bold", width: 200 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {industries.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((industry) => (
                <TableRow key={industry.id}>
                  <TableCell>{industry.id}</TableCell>
                  <TableCell>{industry.name}</TableCell>
                  <TableCell>{industry.description}</TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleOpenViewModal(industry)}>
                      <Visibility />
                    </IconButton>
                   <IconButton color="warning" onClick={() => openEditForm(industry)}>
  <Edit />
</IconButton>

                    <IconButton color="error" onClick={() => handleDelete(industry.id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Modal open={isViewModalOpen} onClose={handleCloseViewModal}>
  <Box sx={{
    position: "absolute", top: "50%", left: "50%",
    transform: "translate(-50%, -50%)", bgcolor: "background.paper",
    p: 4, borderRadius: 2, minWidth: 300
  }}>
    <Typography variant="h6" sx={{ mb: 2 }}>Industry Details</Typography>
    {selectedIndustry && (
      <>
        <Typography><strong>ID:</strong> {selectedIndustry.id}</Typography>
        <Typography><strong>Name:</strong> {selectedIndustry.name}</Typography>
        <Typography><strong>Description:</strong> {selectedIndustry.description}</Typography>
      </>
    )}
    <Button onClick={handleCloseViewModal} sx={{ mt: 3 }} variant="contained" color="secondary" startIcon={<Close />}>
      Close
    </Button>
  </Box>
</Modal>

<Modal open={isFormOpen} onClose={() => setIsFormOpen(false)}>
  <Box sx={{
    position: "absolute", top: "50%", left: "50%",
    transform: "translate(-50%, -50%)", bgcolor: "background.paper",
    p: 4, borderRadius: 2, minWidth: 600
  }}>
    <Typography variant="h6" sx={{ mb: 2 }}>
      {isEditMode ? "Edit Industry" : "Add New Industry"}
    </Typography>
    <form onSubmit={handleSubmit}>
      <TextField
        fullWidth
        label="Name"
        name="name"
        variant="outlined"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        sx={{ mb: 2 }}
        required
      />
      <TextField
        fullWidth
        label="Description"
        name="description"
        variant="outlined"
        multiline
        rows={4}
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        sx={{ mb: 2 }}
        required
      />

      <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
        <Button
          variant="outlined"
          color="error"
          fullWidth
          onClick={() => {
            setIsFormOpen(false);
            setFormData({ name: "", description: "" });
            setIsEditMode(false);
            setEditingId(null);
          }}
        >
          Close
        </Button>
        <Button type="submit" variant="contained" fullWidth>
          {isEditMode ? "Update" : "Add"}
        </Button>
      </Box>
    </form>
  </Box>
</Modal>

    
        <TablePagination
          component="div"
          count={industries.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
    </Box>
  );
};

export default IndustryForm;
