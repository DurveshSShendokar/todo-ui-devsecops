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
  CircularProgress,
  TextField,
  Button,
} from "@mui/material";
import { API_BASE_URL } from "../../utils/apiClient";

const BASE_URL =`${API_BASE_URL}/contact`; // ✅ Change if needed

const DealClose = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState(() => {
    return JSON.parse(localStorage.getItem("dealCloseComments")) || {}; // ✅ Load comments from localStorage
  });
  const [newComments, setNewComments] = useState({});

  useEffect(() => {
    fetchDealCloseContacts();
  }, []);

  // ✅ Fetch contacts with "Deal Close" status
  const fetchDealCloseContacts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/getContactsWithDealCloseStatus`); // ✅ Fetch Deal Close contacts
      setContacts(response.data);

      // ✅ Ensure comments exist for each contact in localStorage
      const savedComments = JSON.parse(localStorage.getItem("dealCloseComments")) || {};
      response.data.forEach((contact) => {
        if (!savedComments[contact.id]) {
          savedComments[contact.id] = [];
        }
      });
      setComments(savedComments);
      localStorage.setItem("dealCloseComments", JSON.stringify(savedComments));
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
    setLoading(false);
  };

  // ✅ Add a new comment and persist in localStorage
  const addComment = (contactId) => {
    if (!newComments[contactId]?.trim()) {
      alert("Comment cannot be empty!");
      return;
    }

    const timestamp = new Date().toLocaleString();
    const newComment = {
      text: newComments[contactId],
      timestamp,
    };

    // ✅ Store comments in state (most recent first)
    const updatedComments = {
      ...comments,
      [contactId]: [newComment, ...(comments[contactId] || [])],
    };
    setComments(updatedComments);

    // ✅ Save to localStorage
    localStorage.setItem("dealCloseComments", JSON.stringify(updatedComments));

    // ✅ Clear input field
    setNewComments((prev) => ({
      ...prev,
      [contactId]: "",
    }));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="bold">
        Contacts with Deal Close Status
      </Typography>

      {loading && <CircularProgress sx={{ mt: 2 }} />}

      {/* Contacts Table */}
      <Table sx={{ mt: 3 }}>
        <TableHead>
          <TableRow>
            <TableCell><strong>Contact ID</strong></TableCell>
            <TableCell><strong>Contact Name</strong></TableCell>
            <TableCell><strong>Email</strong></TableCell>
            <TableCell><strong>Contact Number</strong></TableCell>
            <TableCell><strong>LinkedIn</strong></TableCell>
            <TableCell><strong>Comments</strong></TableCell>
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
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    <TextField
                      size="small"
                      label="Add a comment"
                      value={newComments[contact.id] || ""}
                      onChange={(e) =>
                        setNewComments((prev) => ({
                          ...prev,
                          [contact.id]: e.target.value,
                        }))
                      }
                    />
                    <Button
                      onClick={() => addComment(contact.id)}
                      variant="outlined"
                      size="small"
                    >
                      Add Comment
                    </Button>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ maxHeight: 150, overflowY: "auto", p: 1 }}>
                    {comments[contact.id]?.length > 0 ? (
                      comments[contact.id].map((comment, index) => (
                        <Box key={index} sx={{ mb: 1, p: 1, bgcolor: "#f5f5f5", borderRadius: 1 }}>
                          <Typography variant="body2"><strong>{comment.timestamp}</strong></Typography>
                          <Typography variant="body1">{comment.text}</Typography>
                        </Box>
                      ))
                    ) : (
                      <Typography variant="body2" color="gray">
                        No comments yet.
                      </Typography>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6}>No contacts with Deal Close status found.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Box>
  );
};

export default DealClose;
