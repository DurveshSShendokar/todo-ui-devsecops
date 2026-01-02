import axios from "axios";
import { API_BASE_URL } from "../utils/apiClient";


const BASE_URL = `${API_BASE_URL}/product`; 

// ✅ Add a new product
export const addProduct = async (productData) => {
  try {
    const response = await axios.post(`${BASE_URL}/addProduct`, productData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data; 
  } catch (error) {
    console.error("Error adding product:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ Get all products
export const getAllProducts = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/getAllProductList`);
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error.message);
    return []; // Return empty array to prevent UI crash
  }
};


export const getAllProductssss = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/getAllProductList`);
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error.message);
    return []; // Return empty array to prevent UI crash
  }
};


// ✅ Update an existing product
export const updateProduct = async (productId, updatedData) => {
  try {
    const response = await axios.put(`${BASE_URL}/updateProduct/${productId}`, updatedData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating product:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ Delete a product
export const deleteProduct = async (productId) => {
  try {
    const response = await axios.delete(`${BASE_URL}/deleteProduct/${productId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting product:", error.response?.data || error.message);
    throw error;
  }
};
