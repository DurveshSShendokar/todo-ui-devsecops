import React, { useState } from "react";
import { Box, TextField, Button, Typography, Paper, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { addCampaign } from "../../Services/CampaignService";
import { getAllProducts } from "../../Services/ProductService";

const CampaignForm = ({ darkMode, onCampaignAdded }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [products, setProducts] = useState([]);

   useEffect(() => {
  
      fetchProducts();
    }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addCampaign(formData);
      setFormData({ name: "", description: "" });
      onCampaignAdded();
    } catch (error) {
      console.error("Error adding campaign:", error);
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

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
      <Paper elevation={3} sx={{ padding: 4, maxWidth: 500, width: "100%", mb: 4 }}>
        <Typography variant="h5" sx={{ textAlign: "center", mb: 2, fontWeight: "bold" }}>
          Add New Campaign
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField fullWidth label="Name" name="name" variant="outlined" value={formData.name} onChange={handleChange} sx={{ mb: 2 }} required />
          <TextField fullWidth label="Description" name="description" variant="outlined" multiline rows={3} value={formData.description} onChange={handleChange} sx={{ mb: 2 }} required />
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
          <Button type="submit" variant="contained" fullWidth>
            Submit
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default CampaignForm;
