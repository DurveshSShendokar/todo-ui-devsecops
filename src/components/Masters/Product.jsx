import React, { useEffect, useState } from "react";
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Modal, Paper, Pagination, Button
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility"; // Read Icon
import ProductForm from "./ProductForm";
import { getAllProducts, deleteProduct } from "../../Services/ProductService";
import * as XLSX from "xlsx"; // For Export to Excel
import { Close, GetApp } from "@mui/icons-material";

const Product = ({ darkMode }) => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const rowsPerPage = 5; // Number of rows per page

  // ✅ Modal States
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await getAllProducts();
      setProducts(data);
      setOpenEditModal(false)
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleProductAddedOrUpdated = () => {
    loadProducts(); // Refresh list after adding or updating a product
  };

  const handleOpenModal = (product) => {
    setSelectedProduct(product);
    setOpenModal(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setOpenEditModal(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(productId);
        loadProducts(); // Refresh list
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  // ✅ Handle pagination change
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  // ✅ Paginate products
  const paginatedProducts = products.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  // ✅ Export to Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(products);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Products");
    XLSX.writeFile(workbook, "Product_List.xlsx");
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold", color: darkMode ? "#ffffff" : "#000000" }}>
        Product Management
      </Typography>

      {/* Add Product Form */}
      {/* <ProductForm darkMode={darkMode} onProductAdded={handleProductAddedOrUpdated} /> */}

         <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 4 }}>
<Button
  variant="contained"
  onClick={() => {
    setSelectedProduct(null); // Clear form for Add mode
    setOpenEditModal(true);
  }}
  sx={{ mb: 2 }}
>
  Add Product
</Button>
      {/* Product List */}
      <Typography variant="h6" sx={{ mt: 4, color: darkMode ? "#ffffff" : "#000000" }}>
        Product List
      </Typography>

      {/* Export Button */}
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
      <TableContainer sx={{ mt: 2 }}>
        <Table sx={{ minWidth: 600, backgroundColor: darkMode ? "#424242" : "#ffffff" }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: darkMode ? "#333" : "#e3f2fd"  }}>
              <TableCell sx={{ fontWeight: "bold", color: darkMode ? "#ffffff" : "#000000" }}>Product Name</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: darkMode ? "#ffffff" : "#000000" }}>Description</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: darkMode ? "#ffffff" : "#000000" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell sx={{ color: darkMode ? "#ffffff" : "#000000" }}>{product.productName}</TableCell>
                <TableCell sx={{ color: darkMode ? "#ffffff" : "#000000" }}>{product.description}</TableCell>
                <TableCell>
                  {/* ✅ Read (👁️) Button */}
                  <IconButton color="primary" onClick={() => handleOpenModal(product)}>
                    <VisibilityIcon />
                  </IconButton>
                  {/* ✅ Edit Button */}
                  <IconButton color="warning" onClick={() => handleEditProduct(product)}>
                    <EditIcon />
                  </IconButton>
                  {/* ✅ Delete Button */}
                  <IconButton color="error" onClick={() => handleDeleteProduct(product.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ✅ Pagination Component */}
      <Pagination
        count={Math.ceil(products.length / rowsPerPage)}
        page={page}
        onChange={handlePageChange}
        color="primary"
        sx={{ mt: 3, display: "flex", justifyContent: "center" }}
      />

      {/* ✅ Modal for Viewing Product Details */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 800,
            bgcolor: darkMode ? "#333" : "white",
            boxShadow: 24,
            p: 4,
            borderRadius: 2
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
            Product Details
          </Typography>
          {selectedProduct && (
            <>
              <Typography><strong>ID:</strong> {selectedProduct.id}</Typography>
              <Typography><strong>Product Name:</strong> {selectedProduct.productName}</Typography>
              <Typography><strong>Description:</strong> {selectedProduct.description}</Typography>
            </>
          )}
             <Button onClick={()=>setOpenModal(false)} sx={{ mt: 3 }} variant="contained" color="secondary" startIcon={<Close />}>
                Close
              </Button>
        </Box>
      </Modal>

      {/* ✅ Modal for Editing Product */}
      <Modal open={openEditModal} onClose={() => setOpenEditModal(false)} className="mt-20 "        >
       <ProductForm
  darkMode={darkMode}
  existingProduct={selectedProduct}
  onProductAdded={() => {
    handleProductAddedOrUpdated();
    setOpenEditModal(false); // Auto close modal
  }}
  onClose={() => setOpenEditModal(false)} // Manual close via button
/>

      </Modal>
    </Box>
  );
};

export default Product;
