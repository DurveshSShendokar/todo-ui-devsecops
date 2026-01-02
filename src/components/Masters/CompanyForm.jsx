import React, { useState, useEffect } from "react";
import {
  Box, TextField, Button, Typography, Paper,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, MenuItem, Select, FormControl, InputLabel, Modal, TablePagination
} from "@mui/material";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Visibility, Edit, Delete, FileDownload } from "@mui/icons-material";
import { addCompany, getAllCompanies, getAllIndustries, getAllProducts, updateCompany, deleteCompany } from "../../Services/CompanyService";
import ReusableModal from "../common/ReusableModal";

const CompanyForm = ({ darkMode }) => {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    industryId: "",
    productId: "",
  });

  const [companies, setCompanies] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [formMode, setFormMode] = useState("add");

  // Modals
  const [openModal, setOpenModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchCompanies();
    fetchIndustries();
    fetchProducts();
  }, []);

  const fetchCompanies = async () => {
    try {
      const data = await getAllCompanies();
      setCompanies(data);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  const fetchIndustries = async () => {
    try {
      const data = await getAllIndustries();
      setIndustries(data);
    } catch (error) {
      console.error("Error fetching industries:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const data = await getAllProducts();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updateCompany(selectedCompany.id, {
          name: formData.name,
          location: formData.location,
          industry: { id: formData.industryId },
          product: { id: formData.productId },
        });
      } else {
        await addCompany({
          name: formData.name,
          location: formData.location,
          industry: { id: formData.industryId },
          product: { id: formData.productId },
        });
      }

      setFormData({ name: "", location: "", industryId: "", productId: "" });
      setIsEditing(false);
      setOpenModal(false);
      fetchCompanies();
    } catch (error) {
      console.error("❌ Error saving company:", error);
    }
  };

  const handleDeleteClick = async (id) => {
    if (!id) {
      console.error("Invalid company ID for deletion.");
      return;
    }

    const confirmDelete = window.confirm("Are you sure you want to delete this company?");
    if (!confirmDelete) return;

    try {
      await deleteCompany(id); // Pass only the ID
      fetchCompanies(); // Refresh the list after deletion
    } catch (error) {
      console.error("❌ Error deleting company:", error);
    }
  };

  // Open Add New Modal
  const handleAddNewClick = () => {
    setFormData({ name: "", location: "", industryId: "", productId: "" });
    setFormMode("add");
    setOpenModal(true);
  };
  // ✅ Open Edit Modal
  const handleEditClick = (company) => {
    setSelectedCompany(company);
    setFormData({
      name: company.name,
      location: company.location,
      industryId: company.industry ? company.industry.id : "",
      productId: company.product ? company.product.id : "",
    });
    setIsEditing(true);
    setFormMode("edit");
    setOpenModal(true);
  };

  // ✅ Open Read Modal
  const handleReadClick = (company) => {
    setSelectedCompany(company);
    setFormMode("view");
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setFormData({ name: "", location: "", industryId: "", productId: "" });
    setSelectedCompany(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // ✅ Export to Excel Function
  const exportToExcel = () => {
    const formattedData = companies.map((company) => ({
      ID: company.id,
      Name: company.name,
      Location: company.location,
      Industry: company.industry ? company.industry.name : "N/A",
      Product: company.product ? company.product.productName : "N/A",
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Companies");

    // Create Excel file and trigger download
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(dataBlob, "Companies.xlsx");
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 5 }}>
     
     
      {/* ✅ Company List */}
      <Box sx={{ width: "100%" }}>
        
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 4 }}>
            <Button variant="contained" onClick={handleAddNewClick} sx={{ mb: 2 }}>
          Add New Company
        </Button>

        <Typography variant="h6" sx={{ textAlign: "center", mb: 2, fontWeight: "bold" }}>
          Company List
        </Typography>

         <Button
        variant="contained"
        color="success"
        startIcon={<FileDownload />}
        onClick={exportToExcel}
        sx={{ mb: 2 }}
      >
        Export to Excel
      </Button>
</Box>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 600, backgroundColor: darkMode ? "#424242" : "#ffffff" }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: darkMode ? "#333" : "#e3f2fd" }}>
                <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Company Name</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Location</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Industry</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Product</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {companies.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((company) => (
                <TableRow key={company.id}>
                  <TableCell>{company.id}</TableCell>
                  <TableCell>{company.name}</TableCell>
                  <TableCell>{company.location}</TableCell>
                  <TableCell>{company.industry ? company.industry.name : "N/A"}</TableCell>
                  <TableCell>{company.product ? company.product.productName : "N/A"}</TableCell>
                  <TableCell>
                    <IconButton color="warning" onClick={() => handleEditClick(company)}>
                      <Edit />
                    </IconButton>
                    <IconButton color="primary" onClick={() => handleReadClick(company)}>
                      <Visibility />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDeleteClick(company.id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={companies.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>

      {/* ✅ Reusable Modal */}
      <ReusableModal
        open={openModal}
        onClose={handleCloseModal}
        title={formMode === "add" ? "Add Company" : formMode === "edit" ? "Edit Company" : "Company Details"}
        onSubmit={formMode !== "view" ? handleSubmit : null}
        submitLabel={formMode === "edit" ? "Update" : "Submit"}
        showSubmitButton={formMode !== "view"}
      >
        {formMode === "view" ? (
          <>
            {selectedCompany && (
              <>
                <Typography><strong>ID:</strong> {selectedCompany.id}</Typography>
                <Typography><strong>Name:</strong> {selectedCompany.name}</Typography>
                <Typography><strong>Location:</strong> {selectedCompany.location}</Typography>
                <Typography><strong>Industry:</strong> {selectedCompany.industry ? selectedCompany.industry.name : "N/A"}</Typography>
                <Typography><strong>Product:</strong> {selectedCompany.product ? selectedCompany.product.productName : "N/A"}</Typography>
              </>
            )}
          </>
        ) : (
          <>
            <TextField fullWidth label="Company Name" name="name" variant="outlined" value={formData.name} onChange={handleChange} sx={{ mb: 2,mt: 2 }} required />
            <TextField fullWidth label="Location" name="location" variant="outlined" value={formData.location} onChange={handleChange} sx={{ mb: 2 }} required />

            {/* Industry Dropdown */}
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Industry</InputLabel>
              <Select name="industryId" value={formData.industryId} onChange={handleChange} required>
                {industries.map((industry) => (
                  <MenuItem key={industry.id} value={industry.id}>
                    {industry.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Product Dropdown */}
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

export default CompanyForm;
