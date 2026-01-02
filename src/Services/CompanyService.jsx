import axios from "axios";
import { API_BASE_URL } from "../utils/apiClient";

const BASE_URL = `${API_BASE_URL}/company`;
const INDUSTRY_URL = `${API_BASE_URL}/industry/getAllIndustryList`;
const PRODUCT_URL = `${API_BASE_URL}/product/getAllProductList`;

// ✅ Function to add a new company
export const addCompany = async (companyData) => {
  try {
    const response = await axios.post(`${BASE_URL}/addCompany`, companyData);
    return response.data;
  } catch (error) {
    console.error("❌ Error adding company:", error.response?.data || error.message);
    throw error;
  }
};

export const updateCompany = async (id, updatedData) => {
  try {
    const response = await axios.put(`${BASE_URL}/updateCompany/${id}`, updatedData);
    return response.data;
  } catch (error) {
    console.error("❌ Error updating company:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ Function to get all companies
export const getAllCompanies = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/getAllCompanyList`);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching companies:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ Function to get all industries
export const getAllIndustries = async () => {
  try {
    const response = await axios.get(INDUSTRY_URL);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching industries:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ Function to get all products
export const getAllProducts = async () => {
  try {
    const response = await axios.get(PRODUCT_URL);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching products:", error.response?.data || error.message);
    throw error;
  }

  
};
// ✅ Function to delete a company
export const deleteCompany = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/deleteCompany/${id}`);
    return response.data;
  } catch (error) {
    console.error("❌ Error deleting company:", error.response?.data || error.message);
    throw error;
  }
};


