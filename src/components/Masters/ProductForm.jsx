import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Typography, Paper } from "@mui/material";
import { addProduct, updateProduct } from "../../Services/ProductService";

const ProductForm = ({ darkMode, existingProduct, onProductAdded, onClose }) => {

  const [formData, setFormData] = useState({
    productName: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (existingProduct) {
      setFormData({
        productName: existingProduct.productName || "",
        description: existingProduct.description || "",
      });
    }
  }, [existingProduct]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (existingProduct) {
        await updateProduct(existingProduct.id, formData);
        setSuccess("Product updated successfully! ✅");
      } else {
        await addProduct(formData);
        setSuccess("Product added successfully! ✅");
      }
      setFormData({ productName: "", description: "" }); // Reset form
      onProductAdded();
    } catch (error) {
      setError("Failed to process request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          maxWidth: 500,
          width: "100%",
          backgroundColor: darkMode ? "#333" : "#f9f9f9",
          color: darkMode ? "#ffffff" : "#000000",
          borderRadius: 2,
        }}
      >
        <Typography variant="h5" sx={{ textAlign: "center", mb: 2, fontWeight: "bold" }}>
          {existingProduct ? "Edit Product" : "Add New Product"}
        </Typography>

        {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
        {success && <Typography color="success.main" sx={{ mb: 2 }}>{success}</Typography>}

     <form onSubmit={handleSubmit}>
  <TextField
    fullWidth
    label="Product Name"
    name="productName"
    variant="outlined"
    value={formData.productName}
    onChange={handleChange}
    required
    sx={{ mb: 2 }}
  />
  <TextField
    fullWidth
    label="Description"
    name="description"
    variant="outlined"
    multiline
    rows={4}
    value={formData.description}
    onChange={handleChange}
    required
    sx={{ mb: 2 }}
  />

  <Box sx={{ display: "flex", gap: 2 }}>
    <Button
      type="submit"
      variant="contained"
      fullWidth
      disabled={loading}
    >
      {loading ? "Processing..." : existingProduct ? "Update" : "Submit"}
    </Button>
    <Button
      type="button"
      variant="outlined"
      color="error"
      fullWidth
      onClick={onClose}
    >
      Close
    </Button>
  </Box>
</form>

      </Paper>
    </Box>
  );
};

export default ProductForm;
