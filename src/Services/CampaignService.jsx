import axios from "axios";
import { API_BASE_URL } from "../utils/apiClient";

const BASE_URL = `${API_BASE_URL}/campaign`;

// ✅ Add a new campaign
export const addCampaign = async (campaignData) => {
  try {
    const response = await axios.post(`${BASE_URL}/addCampaign`, campaignData);
    return response.data;
  } catch (error) {
    console.error("Error adding campaign:", error);
    throw error;
  }
};

// ✅ Get all campaigns
export const getAllCampaigns = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/getAllCampaignList`);
    return response.data;
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    throw error;
  }
};

// ✅ Delete a campaign
export const deleteCampaign = async (id) => {
  try {
    await axios.delete(`${BASE_URL}/deleteCampaign/${id}`);
  } catch (error) {
    console.error("Error deleting campaign:", error);
    throw error;
  }
};

// ✅ Update a campaign
export const updateCampaign = async (id, campaignData) => {
  try {
    const response = await axios.put(`${BASE_URL}/updateCampaign/${id}`, campaignData);
    return response.data;
  } catch (error) {
    console.error("Error updating campaign:", error);
    throw error;
  }
};
