import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  IconButton,
  Paper,
  Typography,
  Grid,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import { fetchData } from "../../utils/apiClient";
import { showToast, ToastTypes } from "../toast";

const PartnerMaster = ({ darkMode }) => {
  const [partners, setPartners] = useState([]);
  const [lengthData, setLengthData] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [editingPartner, setEditingPartner] = useState(null);
  const [form, setForm] = useState({
    id: 0,
    partnerType: "INDIVIDUAL", // default selected
    name: "",
    emailId: "",
    contact: "",
    gender: "",
    panNo: "",
    businessName: "",
    gstNo: "",
  });
  const [searchKeyword, setSearchKeyword] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const getPartners = async (keyword = "") => {
    try {
      const res = await fetchData(
        `/api/partners/list?page=${page + 1}&size=${rowsPerPage}&keyword=${keyword}`
      );
      setPartners(res.content || []);
      setLengthData(res.totalElements || 0);
    } catch (err) {
      console.error("Error fetching partners:", err);
    }
  };

  useEffect(() => {
    getPartners(searchKeyword);
  }, [searchKeyword, page, rowsPerPage]);

  const handleOpenModal = (partner = null) => {
    setEditingPartner(partner);
    setForm(
      partner || {
        id: 0,
        partnerType: "INDIVIDUAL",
        name: "",
        emailId: "",
        contact: "",
        gender: "",
        panNo: "",
        businessName: "",
        gstNo: "",
      }
    );
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingPartner(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // If partnerType changes, clear business fields if INDIVIDUAL
    if (name === "partnerType") {
      setForm((prev) => ({
        ...prev,
        partnerType: value,
        // clear business fields if switched to INDIVIDUAL
        ...(value === "INDIVIDUAL"
          ? { businessName: "", gstNo: "" }
          : {}),
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSavePartner = async () => {
    try {
      const url = editingPartner
        ? `/api/partners/${editingPartner.id}`
        : "/api/partners";
      const method = editingPartner ? "PUT" : "POST";

      // Prepare payload, exclude business fields if INDIVIDUAL
      const payload = { ...form };
      if (form.partnerType === "INDIVIDUAL") {
        delete payload.businessName;
        delete payload.gstNo;
      }

      const response = await fetchData(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response) {
        showToast(response.message || "Success", ToastTypes.success);
        setOpenModal(false);
        setEditingPartner(null);
        setForm({
          id: 0,
          partnerType: "INDIVIDUAL",
          name: "",
          emailId: "",
          contact: "",
          gender: "",
          panNo: "",
          businessName: "",
          gstNo: "",
        });
        getPartners(searchKeyword);
      } else {
        showToast("Operation failed", ToastTypes.error);
      }
    } catch (error) {
      console.error("Error saving partner:", error);
      showToast("Error occurred", ToastTypes.error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this partner?")) return;
    try {
      const res = await fetchData(`/api/partners/${id}`, { method: "DELETE" });
      if (res) {
        showToast(res.message, ToastTypes.success);
        getPartners(searchKeyword);
      } else {
        showToast("Failed to delete", ToastTypes.error);
      }
    } catch (err) {
      console.error("Delete error:", err);
      showToast("Delete failed", ToastTypes.error);
    }
  };

  return (
    <Box p={3}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            color: darkMode ? "#ffffff" : "#000000",
          }}
        >
          Partner Master
        </Typography>
      </Box>
      <Box
        display="flex"
        alignItems="center"
        sx={{
          mb: 2,
          gap: 2,
        }}
      >
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenModal()}
        >
          Add Partner
        </Button>
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          sx={{ mr: 2 }}
        />
      </Box>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Sr No.</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>PAN No</TableCell>
              <TableCell>Business Name</TableCell>
              <TableCell>GST No</TableCell>
              <TableCell>Partner Type</TableCell>
              <TableCell sx={{ color: "red" }}>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {partners
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((partner, index) => (
                <TableRow key={partner.id}>
                  <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell>{partner.name}</TableCell>
                  <TableCell>{partner.emailId}</TableCell>
                  <TableCell>{partner.contact}</TableCell>
                  <TableCell>{partner.gender}</TableCell>
                  <TableCell>{partner.panNo}</TableCell>
                  <TableCell>{partner.businessName}</TableCell>
                  <TableCell>{partner.gstNo}</TableCell>
                  <TableCell>{partner.partnerType}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpenModal(partner)}>
                      <Edit sx={{ color: "yellow" }} />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(partner.id)}>
                      <Delete sx={{ color: "red" }} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={lengthData}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(+e.target.value);
            setPage(0);
          }}
        />
      </Paper>

      <Dialog open={openModal} onClose={handleCloseModal} fullWidth maxWidth="md">
        <DialogTitle>{editingPartner ? "Edit Partner" : "Add Partner"}</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            {/* Partner Type first */}
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Partner Type"
                name="partnerType"
                value={form.partnerType}
                onChange={handleChange}
                margin="dense"
              >
                <MenuItem value="INDIVIDUAL">INDIVIDUAL</MenuItem>
                <MenuItem value="BUSINESS">BUSINESS</MenuItem>
              </TextField>
            </Grid>

            {/* Common fields */}
            {[
              { name: "name", label: "Name" },
              { name: "emailId", label: "Email" },
              { name: "contact", label: "Contact" },
              { name: "panNo", label: "PAN No" },
              { name: "gender", label: "Gender", select: true, options: ["Male", "Female"] },
            ].map((field) => (
              <Grid item xs={12} sm={6} key={field.name}>
                {field.select ? (
                  <TextField
                    select
                    fullWidth
                    margin="dense"
                    label={field.label}
                    name={field.name}
                    value={form[field.name]}
                    onChange={handleChange}
                  >
                    {field.options.map((opt) => (
                      <MenuItem key={opt} value={opt}>
                        {opt}
                      </MenuItem>
                    ))}
                  </TextField>
                ) : (
                  <TextField
                    fullWidth
                    margin="dense"
                    label={field.label}
                    name={field.name}
                    value={form[field.name]}
                    onChange={handleChange}
                  />
                )}
              </Grid>
            ))}

            {/* Business fields - only show if BUSINESS */}
            {form.partnerType === "BUSINESS" && (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    margin="dense"
                    label="Business Name"
                    name="businessName"
                    value={form.businessName}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    margin="dense"
                    label="GST No"
                    name="gstNo"
                    value={form.gstNo}
                    onChange={handleChange}
                  />
                </Grid>
              </>
            )}
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseModal}>Cancel</Button>
          <Button onClick={handleSavePartner} variant="contained">
            {editingPartner ? "Update" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PartnerMaster;
