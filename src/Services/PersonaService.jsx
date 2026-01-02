import axios from "axios";
import { API_BASE_URL, fetchData } from "../utils/apiClient";

const BASE_URL = `${API_BASE_URL}/persona`;

// ✅ Function to add a new Persona
export const addPersona = async (personaData) => {
  try {
    const response = await axios.post(`${BASE_URL}/addPersona`, {
      description: personaData.description,
      designation: personaData.designation,
      industry: { id: personaData.industryId },
      product: { id: personaData.productId }, // ✅ Include Product ID
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error adding persona:", error.response?.data || error.message);
    throw error;
  }
};

export const addPersonaDefinations = async (personaData) => {
  try {
    const response = await axios.post(`http://20.219.1.165:8090/personaDefinition/add
`, {
      productId: personaData.productId,
      industryId: personaData.industryId,
      personas: personaData.personas.map(p => ({
        description: p.description,
        designation: p.designation,
        industry: {
          id: p.industry.id,
          name: p.industry.name,
          description: p.industry.description
        },
        product: {
          id: p.product.id,
          productName: p.product.productName,
          description: p.product.description,
          industries: p.product.industries.map(ind => ({
            id: ind.id,
            name: ind.name,
            description: ind.description
          }))
        }
      }))
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error adding personas:", error.response?.data || error.message);
    throw error;
  }
};


export const getAllPersonas = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/getAllPersonaList`);
    
    // Debugging Log
    console.log("✅ Fetched Personas:", response.data);

    return response.data;
  } catch (error) {
    console.error("❌ Error fetching personas:", error.response?.data || error.message);
    throw error;
  }
};


// ✅ Function to update a Persona
export const updatePersona = async (id, personaData) => {
  try {
    const response = await axios.put(`${BASE_URL}/updatePersona/${id}`, {
      description: personaData.description,
      designation: personaData.designation,
      industry: { id: personaData.industryId },
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error updating persona:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ Function to delete a Persona
export const deletePersona = async (id) => {
  try {
    await axios.delete(`${BASE_URL}/deletePersona/${id}`);
  } catch (error) {
    console.error("❌ Error deleting persona:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ Function to get all Industries
export const getAllIndustries = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/industry/getAllIndustryList`);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching industries:", error.response?.data || error.message);
    throw error;
  }


};

export const getIndustriesByProductId = async (productId) => {
  const url = `/product/getProductWithIndustries/${productId}`;
  return await fetchData(url);
};



export const getAllProducts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/product/getAllProductList`);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching products:", error.response?.data || error.message);
    throw error;
  }
};

export const getAllPersonasDefination = async (productId, industryId) => {
  const response = await axios.get(
    `${API_BASE_URL}/persona/personas?productId=${productId}&industryId=${industryId}`
  );
  return response.data;
};