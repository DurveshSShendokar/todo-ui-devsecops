"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
} from "@mui/material";
import { API_BASE_URL } from "../../utils/apiClient";

const BASE_URL = `${API_BASE_URL}/campaign`;
const CONTACTS_URL = `${API_BASE_URL}/contact/getAllContactList`; // ✅ API to get all contacts
const STATUS_OPTIONS = ["Pending", "Active", "Lead", "Completed"]; // ✅ Status options

const ContactMapping = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [contactsLoading, setContactsLoading] = useState(false);
  const [availableContacts, setAvailableContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]); // ✅ Fix: Ensure correct selection
  const [openDialog, setOpenDialog] = useState(false);
  const [assigningContacts, setAssigningContacts] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(null);

  useEffect(() => {
    fetchCampaigns();
    fetchAvailableContacts();
  }, []);

  // ✅ Fetch all campaigns
  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/getAllCampaignList`);
      setCampaigns(response.data);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    }
    setLoading(false);
  };

  // ✅ Fetch contacts for a selected campaign (Fixed)
  const fetchContacts = async (campaignId) => {
    setSelectedCampaign(campaignId);
    setContacts([]); // ✅ Reset previous contacts before fetching new ones
    setContactsLoading(true);

    try {
      const response = await axios.get(`${BASE_URL}/${campaignId}/contacts`);
      setContacts(response.data || []); // ✅ Handle empty response safely
    } catch (error) {
      console.error("Error fetching contacts:", error);
      setContacts([]); // ✅ Prevent broken UI if API fails
    }

    setContactsLoading(false);
  };


  // ✅ Fetch all available contacts
  const fetchAvailableContacts = async () => {
    try {
      const response = await axios.get(CONTACTS_URL);
      setAvailableContacts(response.data);
    } catch (error) {
      console.error("Error fetching available contacts:", error);
    }
  };

  // ✅ Open assign contact dialog
  const handleOpenDialog = (campaignId) => {
    setSelectedCampaign(campaignId);
    setSelectedContacts([]); // ✅ Fix: Clear previous selections
    setOpenDialog(true);
  };

  // ✅ Handle contact selection
  const handleContactSelect = (contactId) => {
    setSelectedContacts((prev) =>
      prev.includes(contactId)
        ? prev.filter((id) => id !== contactId)
        : [...prev, contactId]
    );
  };

  // ✅ Assign multiple contacts (Fixed)
  const assignContacts = async () => {
    if (selectedContacts.length === 0) {
      alert("Please select at least one contact.");
      return;
    }

    setAssigningContacts(true);
    try {
      await axios.post(`${BASE_URL}/${selectedCampaign}/assign-contacts`, selectedContacts);
      alert("Contacts assigned successfully!");
      setOpenDialog(false);
      fetchContacts(selectedCampaign); // ✅ Fix: Refresh assigned contacts after assignment
    } catch (error) {
      console.error("Error assigning contacts:", error);
    }
    setAssigningContacts(false);
  };

  const handleContactStatusChange = async (contactId, newStatus) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/contact/${contactId}/changeStatus?status=${newStatus}` // ✅ Correct format
      );
  
      if (response.status === 200) {
        alert(`Contact ${contactId} status updated to ${newStatus}!`);
        fetchContacts(selectedCampaign); // ✅ Refresh contacts after updating status
      } else {
        alert(`Failed to update status. Server responded with ${response.status}`);
      }
    } catch (error) {
      console.error("Error updating contact status:", error);
      alert("Failed to update contact status. Check console for details.");
    }
  };
  

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="bold">
        Contact Mapping
      </Typography>

      {loading && <CircularProgress sx={{ mt: 2 }} />}

      {/* Campaigns Table */}
      <Table sx={{ mt: 3 }}>
        <TableHead>
          <TableRow>
            <TableCell><strong>Campaign ID</strong></TableCell>
            <TableCell><strong>Campaign Name</strong></TableCell>
            <TableCell><strong>Actions</strong></TableCell> {/* ✅ Removed Status Column */}
          </TableRow>
        </TableHead>
        <TableBody>
          {campaigns.map((campaign) => (
            <TableRow key={campaign.id}>
              <TableCell>{campaign.id}</TableCell>
              <TableCell>{campaign.name}</TableCell>
              <TableCell>
                <Button onClick={() => fetchContacts(campaign.id)} variant="contained">
                  View Contacts
                </Button>
                <Button onClick={() => handleOpenDialog(campaign.id)} sx={{ ml: 2 }} variant="outlined">
                  Assign Contacts
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>


      {contactsLoading ? (
        <CircularProgress sx={{ mt: 2 }} />
      ) : (
        <Table sx={{ mt: 2 }}>
          <TableHead>
            <TableRow>
              <TableCell><strong>Contact ID</strong></TableCell>
              <TableCell><strong>Contact Name</strong></TableCell>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell><strong>Contact Number</strong></TableCell>
              <TableCell><strong>LinkedIn</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell> {/* ✅ Added Status Column */}
            </TableRow>
          </TableHead>
          <TableBody>
            {contacts.length > 0 ? (
              contacts.map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell>{contact.id}</TableCell>
                  <TableCell>{contact.name}</TableCell>
                  <TableCell>{contact.email}</TableCell>
                  <TableCell>{contact.contactNumber}</TableCell>
                  <TableCell>
                    <a href={contact.linkedInAccount} target="_blank" rel="noopener noreferrer">
                      LinkedIn Profile
                    </a>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={contact.status || "Pending"} // ✅ Default to "Pending" if no status
                      onChange={(e) => handleContactStatusChange(contact.id, e.target.value)}
                      sx={{ minWidth: 120 }}
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <MenuItem key={status} value={status}>
                          {status}
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6}>No contacts assigned.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}

      {/* Assign Contact Dialog */}
<Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Assign Contacts</DialogTitle>
        <DialogContent>
          {availableContacts.length > 0 ? (
            availableContacts.map((contact) => (
              <Box key={contact.id} sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedContacts.includes(contact.id)}
                      onChange={() => handleContactSelect(contact.id)}
                    />
                  }
                  label={
                    <Box>
                      <Typography><strong>{contact.name}</strong> (ID: {contact.id})</Typography>
                      <Typography>Email: {contact.email}</Typography>
                      <Typography>Phone: {contact.contactNumber}</Typography>
                      <Typography>
                        <a href={contact.linkedInAccount} target="_blank" rel="noopener noreferrer">
                          LinkedIn Profile
                        </a>
                      </Typography>
                    </Box>
                  }
                />
              </Box>
            ))
          ) : (
            <Typography>No contacts available</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={assignContacts} variant="contained" disabled={assigningContacts}>
            {assigningContacts ? "Assigning..." : "Assign"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ContactMapping;
