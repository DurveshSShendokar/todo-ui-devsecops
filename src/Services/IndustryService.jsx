import axios from "axios";
import { API_BASE_URL } from "../utils/apiClient";

const BASE_URL = `${API_BASE_URL}/industry`;

export const addIndustry = async (industryData) => {
  try {
    const response = await axios.post(`${BASE_URL}/addIndustry`, industryData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding industry:", error.response?.data || error.message);
    throw error;
  }
};

export const getAllIndustries = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/getAllIndustryList`);
    return response.data;
  } catch (error) {
    console.error("Error fetching industries:", error.response?.data || error.message);
    throw error;
  }
};

export const updateIndustry = async (id, industryData) => {
  try {
    const response = await axios.put(`${BASE_URL}/updateIndustry/${id}`, industryData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating industry:", error.response?.data || error.message);
    throw error;
  }
};

export const deleteIndustry = async (id) => {
  try {
    await axios.delete(`${BASE_URL}/deleteIndustry/${id}`);
  } catch (error) {
    console.error("Error deleting industry:", error.response?.data || error.message);
    throw error;
  }
};
