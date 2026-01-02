// import React, { useState, useEffect } from "react";
// import {
//   Box, TextField, Button, Typography, Paper,
//   Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
//   IconButton, MenuItem, Select, FormControl, InputLabel, Modal, TablePagination
// } from "@mui/material";
// import { Visibility, Edit, Delete, FileDownload } from "@mui/icons-material";
// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";
// import { getAllPersonas, addPersona, getAllIndustries, updatePersona, deletePersona } from "../../Services/PersonaService";

// const PersonaForm = ({ darkMode }) => {
//   const [formData, setFormData] = useState({ description: "", designation: "", industryId: "" });
//   const [personas, setPersonas] = useState([]);
//   const [industries, setIndustries] = useState([]);
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   // Modals
//   const [openEditModal, setOpenEditModal] = useState(false);
//   const [selectedPersona, setSelectedPersona] = useState(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const [openReadModal, setOpenReadModal] = useState(false);

//   // Fetch personas & industries on load
//   useEffect(() => {
//     fetchPersonas();
//     fetchIndustries();
//   }, []);

//   const fetchPersonas = async () => {
//     try {
//       const data = await getAllPersonas();
//       console.log("✅ Updated Persona List:", data);
//       setPersonas(data);
//     } catch (error) {
//       console.error("❌ Error fetching personas:", error.response?.data || error.message);
//     }
//   };

//   const fetchIndustries = async () => {
//     try {
//       const data = await getAllIndustries();
//       console.log("✅ Fetched Industries:", data);
//       setIndustries(data);
//     } catch (error) {
//       console.error("❌ Error fetching industries:", error.response?.data || error.message);
//     }
//   };

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       console.log("📤 Sending Persona Data:", formData);

//       if (isEditing) {
//         await updatePersona(selectedPersona.id, formData);
//       } else {
//         await addPersona(formData);
//       }

//       // ✅ Ensure the list updates properly
//       await new Promise((resolve) => setTimeout(resolve, 500)); // Small delay for backend processing
//       await fetchPersonas();

//       // Reset form
//       setFormData({ description: "", designation: "", industryId: "" });
//       setIsEditing(false);
//       setOpenEditModal(false);

//     } catch (error) {
//       console.error("❌ Error saving persona:", error.response?.data || error.message);
//     }
//   };


//   const handleEditClick = (persona) => {
//     setSelectedPersona(persona);
//     setFormData({
//       description: persona.description,
//       designation: persona.designation,
//       industryId: persona.industry ? persona.industry.id : "",
//     });
//     setIsEditing(true);
//     setOpenEditModal(true);
//   };

//   const handleDeleteClick = async (id) => {
//     if (!id) return console.error("Invalid persona ID for deletion.");
//     const confirmDelete = window.confirm("Are you sure you want to delete this persona?");
//     if (!confirmDelete) return;

//     try {
//       await deletePersona(id);
//       fetchPersonas();
//     } catch (error) {
//       console.error("❌ Error deleting persona:", error.response?.data || error.message);
//     }
//   };
//   const handleReadClick = (persona) => {
//     setSelectedPersona(persona);
//     setOpenReadModal(true);
//   };
//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   // ✅ Export to Excel Function
//   const exportToExcel = () => {
//     const formattedData = personas.map((persona) => ({
//       ID: persona.id,
//       Description: persona.description,
//       Designation: persona.designation,
//       Industry: persona.industry ? persona.industry.name : "N/A",
//     }));

//     const worksheet = XLSX.utils.json_to_sheet(formattedData);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Personas");

//     // Create Excel file and trigger download
//     const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
//     const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
//     saveAs(dataBlob, "Personas.xlsx");
//   };

//   return (
//     <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 5 }}>
//       {/* Form */}
//       <Paper elevation={3} sx={{ padding: 4, maxWidth: 500, width: "100%", mb: 4 }}>
//         <Typography variant="h5" sx={{ textAlign: "center", mb: 2, fontWeight: "bold" }}>
//           {isEditing ? "Edit Persona" : "Add New Persona"}
//         </Typography>
//         <form onSubmit={handleSubmit}>
//           <TextField fullWidth label="Description" name="description" variant="outlined" multiline rows={3} value={formData.description} onChange={handleChange} sx={{ mb: 2 }} required />
//           <TextField fullWidth label="Designation" name="designation" variant="outlined" value={formData.designation} onChange={handleChange} sx={{ mb: 2 }} required />

//           {/* Industry Dropdown */}
//           <FormControl fullWidth sx={{ mb: 2 }}>
//             <InputLabel>Industry</InputLabel>
//             <Select name="industryId" value={formData.industryId} onChange={handleChange} required>
//               {industries.map((industry) => (
//                 <MenuItem key={industry.id} value={industry.id}>
//                   {industry.name}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>

//           <Button type="submit" variant="contained" fullWidth>
//             {isEditing ? "Update" : "Submit"}
//           </Button>
//         </form>
//       </Paper>

//       <Button
//         variant="contained"
//         color="success"
//         startIcon={<FileDownload />}
//         onClick={exportToExcel}
//         sx={{ mb: 2 }}
//       >
//         Export to Excel
//       </Button>
//       <Box sx={{ width: "100%" }}>
//         <Typography variant="h6" sx={{ textAlign: "center", mb: 2, fontWeight: "bold" }}>
//           Persona List
//         </Typography>
//         <TableContainer component={Paper}>
//           <Table sx={{ minWidth: 600, backgroundColor: darkMode ? "#424242" : "#ffffff" }}>
//                 <TableHead>
//                   <TableRow sx={{ backgroundColor: darkMode ? "#333" : "#e3f2fd"  }}>
//                 <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
//                 <TableCell sx={{ fontWeight: "bold" }}>Description</TableCell>
//                 <TableCell sx={{ fontWeight: "bold" }}>Designation</TableCell>
//                 <TableCell sx={{ fontWeight: "bold" }}>Industry</TableCell> {/* ✅ Industry Column */}
//                 <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {personas.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((persona) => (
//                 <TableRow key={persona.id}>
//                   <TableCell>{persona.id}</TableCell>
//                   <TableCell>{persona.description}</TableCell>
//                   <TableCell>{persona.designation}</TableCell>
//                   <TableCell>{persona.industry ? persona.industry.name : "N/A"}</TableCell>
//                   <TableCell>
//                     <IconButton color="primary" onClick={() => handleReadClick(persona)}><Visibility /></IconButton>
//                     <IconButton color="warning" onClick={() => handleEditClick(persona)}><Edit /></IconButton>
//                     <IconButton color="error" onClick={() => handleDeleteClick(persona.id)}><Delete /></IconButton>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//         <TablePagination
//           rowsPerPageOptions={[5, 10, 25]}
//           component="div"
//           count={personas.length}
//           rowsPerPage={rowsPerPage}
//           page={page}
//           onPageChange={handleChangePage}
//           onRowsPerPageChange={handleChangeRowsPerPage}
//         />
//       </Box>

//       {/* Edit Persona Modal */}
//       <Modal open={openEditModal} onClose={() => setOpenEditModal(false)}>
//         <Box sx={{
//           position: "absolute",
//           top: "50%", left: "50%",
//           transform: "translate(-50%, -50%)",
//           width: 400, bgcolor: "white", boxShadow: 24, p: 4, borderRadius: 2,
//         }}>
//           <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
//             Edit Persona
//           </Typography>
//           <form onSubmit={handleSubmit}>
//             <TextField fullWidth label="Description" name="description" variant="outlined" multiline rows={3} value={formData.description} onChange={handleChange} sx={{ mb: 2 }} required />
//             <TextField fullWidth label="Designation" name="designation" variant="outlined" value={formData.designation} onChange={handleChange} sx={{ mb: 2 }} required />
//             <Button type="submit" variant="contained" fullWidth>
//               Update
//             </Button>
//           </form>
//         </Box>
//       </Modal>









//       <Modal open={openReadModal} onClose={() => setOpenReadModal(false)}>
//         <Box sx={{
//           position: "absolute",
//           top: "50%", left: "50%",
//           transform: "translate(-50%, -50%)",
//           width: 400, bgcolor: "white", boxShadow: 24, p: 4, borderRadius: 2,
//         }}>
//           <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
//             Persona Details
//           </Typography>
//           {selectedPersona && (
//             <>
//               <Typography><strong>Description:</strong> {selectedPersona.description}</Typography>
//               <Typography><strong>Designation:</strong> {selectedPersona.designation}</Typography>
//               <Typography><strong>Industry:</strong> {selectedPersona.industry ? selectedPersona.industry.name : "N/A"}</Typography>
//             </>
//           )}
//         </Box>
//       </Modal>

//     </Box>
//   );
// };

// export default PersonaForm;



import React, { useState, useEffect } from "react";
import {
  Box, TextField, Button, Typography, Paper,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, MenuItem, Select, FormControl, InputLabel, TablePagination
} from "@mui/material";
import { Visibility, Edit, Delete, FileDownload } from "@mui/icons-material";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {
  getAllPersonas, addPersona, getAllIndustries,
  updatePersona, deletePersona
} from "../../Services/PersonaService";
import ReusableModal from "../common/ReusableModal";
import { getAllProducts } from "../../Services/ProductService";

const PersonaForm = ({ darkMode }) => {
  const [formData, setFormData] = useState({ description: "", designation: "", industryId: "" });
  const [personas, setPersonas] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [modalOpen, setModalOpen] = useState(false);
  const [formMode, setFormMode] = useState("add"); // add | edit | view
  const [selectedPersona, setSelectedPersona] = useState(null);
 const [products, setProducts] = useState([]);
  useEffect(() => {
    fetchPersonas();
    fetchIndustries();
        fetchProducts();
  }, []);

  const fetchPersonas = async () => {
    try {
      const data = await getAllPersonas();
      setPersonas(data);
    } catch (error) {
      console.error("Error fetching personas:", error);
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


  const fetchIndustries = async () => {
    try {
      const data = await getAllIndustries();
      setIndustries(data);
    } catch (error) {
      console.error("Error fetching industries:", error);
    }
  };

  const handleOpenModal = (mode, persona = null) => {
    setFormMode(mode);
    setSelectedPersona(persona);
    setModalOpen(true);
    if (mode === "edit" || mode === "view") {
      setFormData({
        description: persona.description,
        designation: persona.designation,
        industryId: persona.industry ? persona.industry.id : "",
      });
    } else {
      setFormData({ description: "", designation: "", industryId: "" });
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setFormData({ description: "", designation: "", industryId: "" });
    setSelectedPersona(null);
    setFormMode("add");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (formMode === "edit" && selectedPersona) {
        await updatePersona(selectedPersona.id, formData);
      } else {
        await addPersona(formData);
      }
      await fetchPersonas();
      handleCloseModal();
    } catch (error) {
      console.error("Error saving persona:", error);
    }
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm("Are you sure you want to delete this persona?")) {
      try {
        await deletePersona(id);
        fetchPersonas();
      } catch (error) {
        console.error("Error deleting persona:", error);
      }
    }
  };

  const exportToExcel = () => {
    const formatted = personas.map(p => ({
      ID: p.id,
      Description: p.description,
      Designation: p.designation,
      Industry: p.industry?.name || "N/A",
    }));

    const worksheet = XLSX.utils.json_to_sheet(formatted);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Personas");

    const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    saveAs(blob, "Personas.xlsx");
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 5 }}>
      {/* <Paper elevation={3} sx={{ padding: 4, maxWidth: 500, width: "100%", mb: 4 }}>
        <Typography variant="h5" sx={{ textAlign: "center", mb: 2, fontWeight: "bold" }}>
          Add New Persona
        </Typography>
        <Button fullWidth variant="contained" onClick={() => handleOpenModal("add")}>
          Open Form
        </Button>
      </Paper> */}

  
      <Box sx={{ width: "100%" }}>
        
       
      
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 4 }}>
            <Button  variant="contained" onClick={() => handleOpenModal("add")}>
              Add New Persona
        </Button>
        <Typography variant="h6" sx={{ textAlign: "center", mb: 2, fontWeight: "bold" }}>
          Persona List
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
          <Table sx={{ minWidth: 600, backgroundColor: darkMode ? "#424242" : "#fff" }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: darkMode ? "#333" : "#e3f2fd" }}>
                <TableCell><strong>ID</strong></TableCell>
                <TableCell><strong>Description</strong></TableCell>
                <TableCell><strong>Designation</strong></TableCell>
                <TableCell><strong>Industry</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {personas.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(persona => (
                <TableRow key={persona.id}>
                  <TableCell>{persona.id}</TableCell>
                  <TableCell>{persona.description}</TableCell>
                  <TableCell>{persona.designation}</TableCell>
                  <TableCell>{persona.industry?.name || "N/A"}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpenModal("view", persona)} color="primary"><Visibility /></IconButton>
                    <IconButton onClick={() => handleOpenModal("edit", persona)} color="warning"><Edit /></IconButton>
                    <IconButton onClick={() => handleDeleteClick(persona.id)} color="error"><Delete /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={personas.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </Box>

      <ReusableModal
        open={modalOpen}
        onClose={handleCloseModal}
        title={
          formMode === "add" ? "Add Persona"
          : formMode === "edit" ? "Edit Persona"
          : "Persona Details"
        }
        onSubmit={formMode !== "view" ? handleSubmit : null}
        submitLabel={formMode === "edit" ? "Update" : "Submit"}
        showSubmitButton={formMode !== "view"}
      >
        {formMode === "view" ? (
          <>
            <Typography><strong>Description:</strong> {formData.description}</Typography>
            <Typography><strong>Designation:</strong> {formData.designation}</Typography>
            <Typography>
              <strong>Industry:</strong> {industries.find(i => i.id === formData.industryId)?.name || "N/A"}
            </Typography>
          </>
        ) : (
          <>
            <TextField
              fullWidth label="Description" name="description"
              variant="outlined" multiline rows={3}
              value={formData.description}
              onChange={handleChange} sx={{ mb: 2 }} required
            />
            <TextField
              fullWidth label="Designation" name="designation"
              variant="outlined" value={formData.designation}
              onChange={handleChange} sx={{ mb: 2 }} required
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Industry</InputLabel>
              <Select
                name="industryId"
                value={formData.industryId}
                onChange={handleChange}
                required
              >
                {industries.map((industry) => (
                  <MenuItem key={industry.id} value={industry.id}>
                    {industry.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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

export default PersonaForm;
