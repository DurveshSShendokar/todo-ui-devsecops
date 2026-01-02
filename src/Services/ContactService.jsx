import axios from "axios";
import { API_BASE_URL } from "../utils/apiClient";

const BASE_URL = `${API_BASE_URL}/contact`;
const INDUSTRY_URL = `${API_BASE_URL}/industry/getAllIndustryList`;
const PERSONA_URL = `${API_BASE_URL}/persona/getAllPersonaList`;
const PRODUCT_URL = `${API_BASE_URL}/product/getAllProductList`;

// ✅ Function to add a new contact
export const addContact = async (contactData) => {
  try {
    const response = await axios.post(`${BASE_URL}/addContact`, contactData);
    return response.data;
  } catch (error) {
    console.error("❌ Error adding contact:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ Function to get all contacts
export const getAllContacts = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/getAllContactList`);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching contacts:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ Function to update a contact
export const updateContact = async (id, contactData) => {
  try {
    const response = await axios.put(`${BASE_URL}/updateContact/${id}`, contactData);
    return response.data;
  } catch (error) {
    console.error(`❌ Error updating contact (ID: ${id}):`, error.response?.data || error.message);
    throw error;
  }
};

// ✅ Function to delete a contact
export const deleteContact = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/deleteContact/${id}`);
    return response.data;
  } catch (error) {
    console.error(`❌ Error deleting contact (ID: ${id}):`, error.response?.data || error.message);
    throw error;
  }
};

// ✅ Function to fetch industries for dropdown
export const getIndustries = async () => {
  try {
    const response = await axios.get(INDUSTRY_URL);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching industries:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ Function to fetch personas for dropdown
export const getPersonas = async () => {
  try {
    const response = await axios.get(PERSONA_URL);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching personas:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ Function to fetch products for dropdown
export const getProducts = async () => {
  try {
    const response = await axios.get(PRODUCT_URL);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching products:", error.response?.data || error.message);
    throw error;
  }
};
