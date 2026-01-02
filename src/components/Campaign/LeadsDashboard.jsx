"use client";

import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../../utils/apiClient";
import { 
  Box, Typography, Tabs, Tab, Grid, Card, CardContent, CircularProgress, Table, TableHead, TableRow, TableCell, TableBody 
} from "@mui/material";
import axios from "axios";

const BASE_URL = `${API_BASE_URL}/contact`;

function LeadDashboard() {
  const [activeTab, setActiveTab] = useState(0); // ✅ Track active tab
  const [statusCounts, setStatusCounts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState(null); 
  const [contacts, setContacts] = useState([]); 
  const [contactsLoading, setContactsLoading] = useState(false); 
  const [totalCampaigns, setTotalCampaigns] = useState(null);
const [campaignLoading, setCampaignLoading] = useState(true);
const [campaignStatusCounts, setCampaignStatusCounts] = useState(null);

  // ✅ Fetch total status counts when "Lead" tab is selected
  useEffect(() => {
    if (activeTab === 1) {
      fetchStatusCounts();
    }
    fetchTotalCampaigns();
    fetchCampaignStatusCounts();
  }, [activeTab]);

  const fetchStatusCounts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/getTotalStatusCounts`);
      setStatusCounts(response.data);
    } catch (error) {
      console.error("Error fetching status counts:", error);
    }
    setLoading(false);
  };

  const fetchTotalCampaigns = async () => {
    setCampaignLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/campaign/totalCampaigns`);
      setTotalCampaigns(response.data.message); // ✅ Extract total campaigns count
    } catch (error) {
      console.error("Error fetching total campaigns:", error);
    }
    setCampaignLoading(false);
  };
 
  const fetchContactsByStatus = async (status) => {
    setContactsLoading(true);
    setSelectedStatus(status); // ✅ Set selected status
    try {
      const response = await axios.get(`${BASE_URL}/getContactsByStatus?status=${status}`);
      setContacts(response.data);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      setContacts([]);
    }
    setContactsLoading(false);
  };
  const fetchCampaignStatusCounts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/campaign/campaignStatusCounts`);
      setCampaignStatusCounts(response.data);
    } catch (error) {
      console.error("Error fetching campaign status counts:", error);
    }
  };
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="bold" >
        Lead Dashboard
      </Typography>

      {/* ✅ Tabs for Campaign & Lead */}
      <Tabs
        value={activeTab}
        onChange={(event, newValue) => setActiveTab(newValue)}
        sx={{ mt: 2, mb: 3 }}
      >
        <Tab label="Campaigns" />
        <Tab label="Leads" />
      </Tabs>

      {/* ✅ Campaign Tab Content */}
      {activeTab === 0 && (
  <Box>
    <Typography variant="h6" sx={{ mb: 2 }}>
      Campaign Overview
    </Typography>

    {campaignLoading ? (
      <CircularProgress />
    ) : (
        <Grid container spacing={2}>
        {/* 🔹 Total Campaigns */}
        <Grid item xs={12} sm={4} md={4}>
          <Card sx={{ bgcolor: "#64b5f6", color: "#000", textAlign: "center" }}>
            <CardContent>
              <Typography variant="h6">Total Campaigns</Typography>
              <Typography variant="h4">{totalCampaigns}</Typography>
            </CardContent>
          </Card>
        </Grid>
      
        {/* 🔹 Open Campaigns */}
        <Grid item xs={12} sm={4} md={4}>
          <Card sx={{ bgcolor: "#81c784", color: "#000", textAlign: "center" }}>
            <CardContent>
              <Typography variant="h6">Open Campaigns</Typography>
              <Typography variant="h4">{campaignStatusCounts?.TotalOpenCampaigns || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
      
        {/* 🔹 Closed Campaigns */}
        <Grid item xs={12} sm={4} md={4}>
          <Card sx={{ bgcolor: "#e57373", color: "#000", textAlign: "center" }}>
            <CardContent>
              <Typography variant="h6">Closed Campaigns</Typography>
              <Typography variant="h4">{campaignStatusCounts?.TotalCloseCampaigns || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
    )}
  </Box>
)}

      {/* ✅ Lead Tab Content */}
      {activeTab === 1 && (
        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Lead Status Overview
          </Typography>

          {loading ? (
            <CircularProgress />
          ) : statusCounts ? (
            <Grid container spacing={2}>
              {/* 🔹 Total SQL Status Count */}
              <Grid item xs={12} sm={6} md={3}>
                <Card 
                  sx={{ bgcolor: "#ffcc80", color: "#000", cursor: "pointer" }}
                  onClick={() => fetchContactsByStatus("SQL")} // ✅ Fetch contacts on click
                >
                  <CardContent>
                    <Typography variant="h6">SQL Status</Typography>
                    <Typography variant="h4">{statusCounts.TotalSQLStatusCount}</Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* 🔹 Total MQL Status Count */}
              <Grid item xs={12} sm={6} md={3}>
                <Card 
                  sx={{ bgcolor: "#90caf9", color: "#000", cursor: "pointer" }}
                  onClick={() => fetchContactsByStatus("MQL")}
                >
                  <CardContent>
                    <Typography variant="h6">MQL Status</Typography>
                    <Typography variant="h4">{statusCounts.TotalMQLStatusCount}</Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* 🔹 Total Lead Status Count */}
              <Grid item xs={12} sm={6} md={3}>
                <Card 
                  sx={{ bgcolor: "#a5d6a7", color: "#000", cursor: "pointer" }}
                  onClick={() => fetchContactsByStatus("Lead")}
                >
                  <CardContent>
                    <Typography variant="h6">Lead Status</Typography>
                    <Typography variant="h4">{statusCounts.TotalLeadStatusCount}</Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* 🔹 Total Deal Close Count */}
              <Grid item xs={12} sm={6} md={3}>
                <Card 
                  sx={{ bgcolor: "#ef9a9a", color: "#000", cursor: "pointer" }}
                  onClick={() => fetchContactsByStatus("Deal Close")}
                >
                  <CardContent>
                    <Typography variant="h6">Deal Closed</Typography>
                    <Typography variant="h4">{statusCounts.TotalDealCloseCount}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          ) : (
            <Typography variant="body1" color="error">
              Error fetching status counts.
            </Typography>
          )}

          {/* ✅ Contacts Table (Shows only when a status is selected) */}
          {selectedStatus && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6">
                Contacts with Status: {selectedStatus}
              </Typography>

              {contactsLoading ? (
                <CircularProgress />
              ) : contacts.length > 0 ? (
                <Table sx={{ mt: 2 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Contact ID</strong></TableCell>
                      <TableCell><strong>Name</strong></TableCell>
                      <TableCell><strong>Email</strong></TableCell>
                      <TableCell><strong>Phone</strong></TableCell>
                      <TableCell><strong>LinkedIn</strong></TableCell>
                      <TableCell><strong>Product</strong></TableCell>
                      <TableCell><strong>Industry</strong></TableCell>
                      <TableCell><strong>Persona</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {contacts.map((contact) => (
                      <TableRow key={contact.id}>
                        <TableCell>{contact.id}</TableCell>
                        <TableCell>{contact.name}</TableCell>
                        <TableCell>{contact.email}</TableCell>
                        <TableCell>{contact.contactNumber}</TableCell>
                        <TableCell>
                          <a href={contact.linkedInAccount} target="_blank" rel="noopener noreferrer">
                            LinkedIn
                          </a>
                        </TableCell>
                        <TableCell>{contact.product?.productName || "N/A"}</TableCell>
                        <TableCell>{contact.industry?.name || "N/A"}</TableCell>
                        <TableCell>{contact.persona?.designation || "N/A"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <Typography sx={{ mt: 2 }} color="gray">
                  No contacts found for {selectedStatus}.
                </Typography>
              )}
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}

export default LeadDashboard;
