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
  TablePagination,
  Button,
  CircularProgress,
  TextField,
  Select,
  MenuItem,
  
} from "@mui/material";
import * as XLSX from "xlsx";
import { API_BASE_URL } from "../../utils/apiClient";

const BASE_URL = `${API_BASE_URL}/contact`; // ✅ Change if needed
const STATUS_OPTIONS = ["PENDING", "SQL", "Completed"]; // ✅ Only these statuses

const MqlStatus = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState(() => {
    return JSON.parse(localStorage.getItem("mqlContactComments")) || {}; // ✅ Load comments from localStorage
  });
  const [newComments, setNewComments] = useState({});
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [page,setPage]=useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const[rowsPerPage,setRowsPerPage]=useState(5);


  useEffect(() => {
    fetchMqlContacts();
  }, []);

  // ✅ Fetch contacts with "MQL" status
  const fetchMqlContacts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/getContactsWithMQLStatus`); // ✅ Fetch MQL contacts
      setContacts(response.data);

      // ✅ Ensure comments exist for each contact in localStorage
      const savedComments = JSON.parse(localStorage.getItem("mqlContactComments")) || {};
      response.data.forEach((contact) => {
        if (!savedComments[contact.id]) {
          savedComments[contact.id] = [];
        }
      });
      setComments(savedComments);
      localStorage.setItem("mqlContactComments", JSON.stringify(savedComments));
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
    setLoading(false);
  };

  // ✅ Update contact status
  const handleStatusChange = async (contactId, newStatus) => {
    setUpdatingStatus(contactId);
    try {
      await axios.post(
        `${BASE_URL}/${contactId}/changeStatus?status=${newStatus}` // ✅ API expects status as query param
      );
      alert(`Contact ${contactId} status updated to ${newStatus}!`);
      fetchMqlContacts(); // ✅ Refresh the list after update
    } catch (error) {
      console.error("Error updating contact status:", error);
    }
    setUpdatingStatus(null);
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
    localStorage.setItem("mqlContactComments", JSON.stringify(updatedComments));

    // ✅ Clear input field
    setNewComments((prev) => ({
      ...prev,
      [contactId]: "",
    }));
  };
  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(contacts);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Contacts");
    XLSX.writeFile(workbook, "MQL_Contacts.xlsx");
  };
  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.contactNumber.includes(searchQuery)
  );

   return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="bold">
        Contacts with MQL Status
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
        <TextField
          label="Search..."
          variant="outlined"
          size="small"
          onChange={handleSearch}
        />
        <Button variant="contained" onClick={exportToExcel}>
          Export to Excel
        </Button>
      </Box>

      {loading && <CircularProgress sx={{ mt: 2 }} />}

      <Table sx={{ mt: 3 }}>
        <TableHead>
          <TableRow>
            <TableCell><strong>Contact ID</strong></TableCell>
            <TableCell><strong>Contact Name</strong></TableCell>
            <TableCell><strong>Email</strong></TableCell>
            <TableCell><strong>Contact Number</strong></TableCell>
            <TableCell><strong>LinkedIn</strong></TableCell>
            <TableCell><strong>Status</strong></TableCell>
            <TableCell><strong>Comments</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredContacts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((contact) => (
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
                  value={contact.status || "PENDING"}
                  onChange={(e) => handleStatusChange(contact.id, e.target.value)}
                  disabled={updatingStatus === contact.id}
                  sx={{ minWidth: 120 }}
                >
                  {STATUS_OPTIONS.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
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
          ))}
        </TableBody>
      </Table>

      <TablePagination
        component="div"
        count={filteredContacts.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={(event, newPage) => setPage(newPage)}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0);
        }}
      />
    </Box>
  );
};

export default MqlStatus;
