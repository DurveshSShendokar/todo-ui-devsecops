import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import { getAllIndustries } from "../../Services/PersonaService";
import { getAllProducts } from "../../Services/ProductService";
import { API_BASE_URL } from "../../utils/apiClient";

const IndustryMapping = ({ darkMode }) => {
  const [products, setProducts] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedIndustries, setSelectedIndustries] = useState([]);
  const [mappings, setMappings] = useState([]); // ✅ Store multiple mappings

  // Fetch products & industries on load
  useEffect(() => {
    fetchProducts();
    fetchIndustries();
    fetchMappings();
  }, []);

  const fetchMappings = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/product/getAllProductIndustryMappings`
      );
      const data = await response.json();
      console.log("✅ Product-Industry Mappings:", data);

      if (!Array.isArray(data)) {
        console.error("❌ Invalid mappings data:", data);
        return;
      }

      setMappings(data); // ✅ Store fetched mappings
    } catch (error) {
      console.error("❌ Error fetching mappings:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/product/getAllProductList`);
      const data = await response.json();
      console.log("✅ Fetched Products:", data);

      if (!Array.isArray(data)) {
        console.error("❌ Invalid product data format:", data);
        return;
      }

      setProducts(data);
    } catch (error) {
      console.error("❌ Error fetching products:", error.message);
    }
  };

  const fetchIndustries = async () => {
    try {
      const data = await getAllIndustries();
      setIndustries(data);
    } catch (error) {
      console.error(
        "❌ Error fetching industries:",
        error.response?.data || error.message
      );
    }
  };

  // Handle Product Selection
  const handleProductChange = (event) => {
    setSelectedProduct(event.target.value);
    setSelectedIndustries([]); // Reset industry selection when a new product is chosen
  };

  // Handle Industry Selection (Checkbox)
  const handleIndustryChange = (event) => {
    const { value, checked } = event.target;
    setSelectedIndustries((prevIndustries) =>
      checked
        ? [...prevIndustries, value]
        : prevIndustries.filter((id) => id !== value)
    );
  };

  // ✅ Save Product-Industry Mapping Without Overwriting
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedProduct || selectedIndustries.length === 0) {
      alert("Please select a product and at least one industry.");
      return;
    }

    const industryIdsString = selectedIndustries.join(","); // Convert array to string

    try {
      const response = await fetch(
        `${API_BASE_URL}/product/assignIndustries?productId=${selectedProduct}&industryIds=${industryIdsString}`,
        { method: "POST" }
      );

      if (!response.ok) throw new Error("Failed to map industries");

      alert("Industries mapped successfully!");
      // setMappings([...mappings, { productId: selectedProduct, industries: selectedIndustries }]);
      await fetchMappings();
      // Reset selection
      setSelectedProduct("");
      setSelectedIndustries([]);
    } catch (error) {
      console.error("Error mapping industries:", error);
      alert("Error mapping industries. Please try again.");
    }

    // Check if product is already mapped
    const existingMappingIndex = mappings.findIndex(
      (mapping) => mapping.productId === selectedProduct
    );

    let updatedMappings;
    if (existingMappingIndex !== -1) {
      // If product exists, update industries
      updatedMappings = [...mappings];
      updatedMappings[existingMappingIndex].industries = selectedIndustries;
    } else {
      // Add new product mapping
      updatedMappings = [
        ...mappings,
        { productId: selectedProduct, industries: selectedIndustries },
      ];
    }

    setMappings(updatedMappings);
    console.log("📤 Updated Mappings:", updatedMappings);

    // Reset selection
    setSelectedProduct("");
    setSelectedIndustries([]);
  };

  // ✅ Delete Mapping
  const handleDeleteMapping = (productId) => {
    setMappings(mappings.filter((mapping) => mapping.productId !== productId));
  };

  return (
    <Box
  sx={{
    p: 4,
    display: "flex",
    flexDirection: "column",
    gap: 4, // spacing between form and table
    alignItems: "center",
    minHeight: "100vh"
  }}
>
  {/* 🎯 Form Section (narrower) */}
  <Paper
    sx={{
      p: 4,
      width: "100%",
      maxWidth: 700,
      backgroundColor: darkMode ? "#202020" : "#ffffff",
      color: darkMode ? "#fff" : "#000",
    }}
  >
    <Typography variant="h4" fontWeight="bold" textAlign="center" sx={{ mb: 2 }}>
      Industry Mapping
    </Typography>

    <form onSubmit={handleSubmit}>
      {/* Product Dropdown */}
      <FormControl fullWidth sx={{ mt: 3 }}>
        <InputLabel sx={{ color: darkMode ? "#fff" : "#000" }}>Product</InputLabel>
        <Select
          value={selectedProduct}
          onChange={handleProductChange}
          required
          sx={{
            backgroundColor: darkMode ? "#202020" : "#ffffff",
            color: darkMode ? "#ffffff" : "#000000"
          }}
        >
          {products.length > 0 ? (
            products.map((product) => (
              <MenuItem key={product.id} value={product.id}>
                {product.productName}
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>No Products Available</MenuItem>
          )}
        </Select>
      </FormControl>

      {/* Industry Checkboxes */}
      <Typography variant="h6" sx={{ mt: 4, mb: 1 }}>
        Select Industries
      </Typography>
      <FormGroup>
        {industries.map((industry) => (
          <FormControlLabel
            key={industry.id}
            control={
              <Checkbox
                value={industry.id}
                checked={selectedIndustries.includes(industry.id.toString())}
                onChange={handleIndustryChange}
                sx={{ color: darkMode ? "#90caf9" : undefined }}
              />
            }
            label={
              <Typography sx={{ color: darkMode ? "#ffffff" : "#000000" }}>
                {industry.name}
              </Typography>
            }
          />
        ))}
      </FormGroup>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="contained"
        fullWidth
        sx={{
          mt: 3,
          backgroundColor: darkMode ? "#1976d2" : undefined,
          color: "#ffffff"
        }}
      >
        Save Mapping
      </Button>
    </form>
  </Paper>

  {/* 📋 Table Section (wider) */}
  {mappings.length > 0 && (
    <Paper
      sx={{
        p: 3,
        width: "100%",
        maxWidth: 1200,
        backgroundColor: darkMode ? "#202020" : "#ffffff"
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, color: darkMode ? "#fff" : "#000" }}>
        Product & Industry Mappings
      </Typography>

      <TableContainer component={Paper} sx={{ backgroundColor: darkMode ? "#424242" : "#ffffff" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: darkMode ? "#333" : "#e3f2fd" }}>
              <TableCell sx={{ fontWeight: "bold", color: darkMode ? "#fff" : "#000" }}>Product Name</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: darkMode ? "#fff" : "#000" }}>Mapped Industries</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: darkMode ? "#fff" : "#000" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mappings.map((mapping) => (
              <TableRow key={mapping.productId}>
                <TableCell sx={{ color: darkMode ? "#fff" : "#000" }}>{mapping.productName}</TableCell>
                <TableCell sx={{ color: darkMode ? "#fff" : "#000" }}>
                  {mapping.industries.length > 0 ? (
                    mapping.industries.map((industry, index) => (
                      <Typography key={industry.industryId} variant="body2">
                        {index + 1}. {industry.industryName}
                      </Typography>
                    ))
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      No industries mapped
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteMapping(mapping.productId)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  )}
</Box>

  );
};

export default IndustryMapping;
