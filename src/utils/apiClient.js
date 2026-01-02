import React from "react";
import axios from "axios";


// export const API_BASE_URL = "http://20.219.1.165:8090";
export const API_BASE_URL = "https://zioteams.zionit.in/";
const instance = axios.create({ baseURL: API_BASE_URL });

export const fetchData = async (endpoint, options = {}) => {
  

  const headers = {
    "Content-Type": "application/json",

    ...options.headers,
  };

  const method = options.method || "GET";

  const response = await Promise.race([
    fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      method,
      headers,
    }),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timed out")), 10000)
    ),
  ]);

  if (!response.ok) {
    const errorResponse = await response.json();
    const message =
      errorResponse.message || response.statusText || "Something went wrong";
    throw new Error(message);
  }

  return await response.json();
  
};
export const getRequest = async (endPoint) => {
  try {
    const token = sessionStorage.getItem("token");
    if (token) {
      instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    const response = await instance.get(endPoint);
    return { data: response.data, status: response.status };
  } catch (error) {
    return error;
  }
};

export const postRequest = async (endPoint, data) => {
  try {
    const token = sessionStorage.getItem("token");
    if (token) {
      instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    const response = await instance.post(endPoint, data);
    return { ...response };
  } catch (error) {
    return error;
  }
};

export const deleteRequest = async (endPoint) => {
  try {
    const token = sessionStorage.getItem("token");
    if (token) {
      instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    const response = await instance.delete(endPoint);
    return { data: response.data, status: response.status };
  } catch (error) {
    return error;
  }
};