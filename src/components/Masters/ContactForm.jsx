import React, { useState, useEffect } from "react";
import {
  Box, TextField, Button, Typography, Paper,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, MenuItem, Select, FormControl, InputLabel, Modal,TablePagination
} from "@mui/material";
import { Visibility, Edit, Delete } from "@mui/icons-material";
import { addContact, getAllContacts, getIndustries, getPersonas, getProducts ,updateContact,deleteContact} from "../../Services/ContactService";

const ContactForm = ({darkMode}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contactNumber: "",
    linkedInAccount: "",
    product: "",
    industry: "",
    persona: "",
  });

  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editing,setEditing] = useState(false);

  const [industries, setIndustries] = useState([]);
  const [products, setProducts] = useState([]);
  const [personas, setPersonas] = useState([]);

  // State for Modal
  const [selectedContact, setSelectedContact] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    fetchContacts();
    fetchIndustries();
    fetchProducts();
    fetchPersonas();
  }, []);

  const fetchContacts = async () => {
    try {
      const data = await getAllContacts();
      setContacts(data);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  const fetchIndustries = async () => {
    try {
      const data = await getIndustries();
      setIndustries(data);
    } catch (error) {
      console.error("Error fetching industries:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page
  };

  const fetchPersonas = async () => {
    try {
      const data = await getPersonas();
      setPersonas(data);
    } catch (error) {
      console.error("Error fetching personas:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const contactPayload = {
        ...formData,
        product: { id: formData.product },
        industry: { id: formData.industry },
        persona: { id: formData.persona }
      };

      await addContact(contactPayload);
      setFormData({
        name: "",
        email: "",
        contactNumber: "",
        linkedInAccount: "",
        product: "",
        industry: "",
        persona: "",
      });
      setTimeout(fetchContacts, 500);
    } catch (error) {
      setError("Failed to add contact. Please try again.");
      console.error("Error adding contact:", error);
    } finally {
      setLoading(false);
    }
  };

  // Open Modal
  const handleOpenModal = (contact) => {
    setSelectedContact(contact);
    setIsModalOpen(true);
  };

  // Close Modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedContact(null);
  };

  const handleEditClick = (contact) => {
    setFormData({
      id: contact.id,
      name: contact.name,
      email: contact.email,
      contactNumber: contact.contactNumber,
      linkedInAccount: contact.linkedInAccount,
      product: contact.product?.id || "",
      industry: contact.industry?.id || "",
      persona: contact.persona?.id || "",
    });
    setEditing(true);
  };

  const handleDeleteClick = async (id) => {
    if (!window.confirm("Are you sure you want to delete this contact?")) return;

    try {
      await deleteContact(id);
      fetchContacts();
    } catch (error) {
      console.error("Error deleting contact:", error);
    }
  }
  const handleCancelEdit = () => {
    setEditing(false); // Set editing mode off
    setFormData({
      name: "",
      email: "",
      contactNumber: "",
      linkedInAccount: "",
      product: "",
      industry: "",
      persona: "",
    }); // Reset form
  };
  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 5 }}>
      {/* Form */}
      <Paper elevation={3} sx={{ padding: 4, maxWidth: 1200, width: "100%", mb: 4 }}>
        <Typography variant="h5" sx={{ textAlign: "center", mb: 2, fontWeight: "bold" }}>
         {editing ? "Edit Contact" : "Add New Contact"}
        </Typography>

        {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}

        <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-3 gap-4">
          <TextField fullWidth label="Name" name="name" variant="outlined" value={formData.name} onChange={handleChange} sx={{ mb: 2 }} required />
          <TextField fullWidth label="Email" name="email" type="email" variant="outlined" value={formData.email} onChange={handleChange} sx={{ mb: 2 }} required />
          <TextField fullWidth label="Contact Number" name="contactNumber" type="tel" variant="outlined" value={formData.contactNumber} onChange={handleChange} sx={{ mb: 2 }} required />
          <TextField fullWidth label="LinkedIn Account" name="linkedInAccount" variant="outlined" value={formData.linkedInAccount} onChange={handleChange} sx={{ mb: 2 }} />

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Industry</InputLabel>
            <Select name="industry" value={formData.industry} onChange={handleChange} required>
              {industries.map((industry) => (
                <MenuItem key={industry.id} value={industry.id}>
                  {industry.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Product</InputLabel>
            <Select name="product" value={formData.product} onChange={handleChange} required>
              {products.map((product) => (
                <MenuItem key={product.id} value={product.id}>
                  {product.productName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Persona</InputLabel>
            <Select name="persona" value={formData.persona} onChange={handleChange} required>
              {personas.map((persona) => (
                <MenuItem key={persona.id} value={persona.id}>
                  {persona.designation} - {persona.description}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
  </div>
 <div className="flex gap-4">
  <Button 
    type="submit" 
    variant="contained" 
    sx={{ flex: 1 }} // Ensures both buttons take equal space
    disabled={loading}
  >
    {loading ? "Saving..." : editing ? "Save Changes" : "Submit"}
  </Button>

  {editing && (
    <Button
      variant="outlined"
      color="error"
      onClick={handleCancelEdit}
      sx={{ flex: 1 }} // Ensures both buttons take equal space
    >
      Cancel
    </Button>
  )}
</div>

        </form>
      </Paper>

      {/* Contact List */}
      <Box sx={{ width: "100%" }}>
        <Typography variant="h6" sx={{ textAlign: "center", mb: 2, fontWeight: "bold" }}>
          Contact List
        </Typography>
        <TableContainer component={Paper}>
  <Table>
    <TableHead>
      <TableRow sx={{ backgroundColor:  darkMode ? "#333" : "#e3f2fd" }}>
        <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
        <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
        <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
        <TableCell sx={{ fontWeight: "bold" }}>Contact Number</TableCell>
        <TableCell sx={{ fontWeight: "bold" }}>LinkedIn</TableCell>
        <TableCell sx={{ fontWeight: "bold" }}>Industry</TableCell>
        <TableCell sx={{ fontWeight: "bold" }}>Product</TableCell>
        <TableCell sx={{ fontWeight: "bold" }}>Persona</TableCell>
        <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {contacts.map((contact) => (
        <TableRow key={contact.id}>
          <TableCell>{contact.id}</TableCell>
          <TableCell>{contact.name}</TableCell>
          <TableCell>{contact.email}</TableCell>
          <TableCell>{contact.contactNumber}</TableCell>
          <TableCell>
            {contact.linkedInAccount ? (
              <a href={contact.linkedInAccount} target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
            ) : "N/A"}
          </TableCell>
          <TableCell>{contact.industry ? contact.industry.name : "N/A"}</TableCell>
          <TableCell>{contact.product ? contact.product.productName : "N/A"}</TableCell>
          <TableCell>{contact.persona ? `${contact.persona.designation} - ${contact.persona.description}` : "N/A"}</TableCell>
          <TableCell sx={{ width: 200 }} >
            <IconButton onClick={() => handleOpenModal(contact)}><Visibility /></IconButton>
            <IconButton color="warning" onClick={() => handleEditClick(contact)}><Edit /></IconButton>
            <IconButton color="error" onClick={() => handleDeleteClick(contact.id)}><Delete /></IconButton>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>


        <TablePagination
          component="div"
          count={contacts.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>

      {/* Modal for Contact Details */}
      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", bgcolor: "background.paper", p: 4, borderRadius: 2 }}>
          <Typography variant="h6">{selectedContact?.name}'s Details</Typography>
          <Typography>Email: {selectedContact?.email}</Typography>
          <Typography>Contact Number: {selectedContact?.contactNumber}</Typography>
          <Button onClick={handleCloseModal} sx={{ mt: 2 }} variant="contained">Close</Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default ContactForm;
