// import React, { useState } from "react";
// import {
//   Box,
//   Tabs,
//   Tab,
//   Typography,
//   List,
//   ListItem,
//   ListItemText,
//   IconButton,
//   Button,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Input,
//   Snackbar,
//   useTheme,
// } from "@mui/material";
// import DeleteIcon from "@mui/icons-material/Delete";
// import ShareIcon from "@mui/icons-material/Share";
// import DownloadIcon from "@mui/icons-material/Download";
// import UploadFileIcon from "@mui/icons-material/UploadFile";

// function TabPanel(props) {
//   const { children, value, index, ...other } = props;

//   return (
//     <div
//       role="tabpanel"
//       hidden={value !== index}
//       id={`document-tabpanel-${index}`}
//       aria-labelledby={`document-tab-${index}`}
//       {...other}
//     >
//       {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
//     </div>
//   );
// }

// const DocumentManager = ({ darkMode = false }) => {
//   const [tab, setTab] = useState(0);

//   const [myDocuments, setMyDocuments] = useState([
//     { id: 1, name: "Resume.pdf" },
//     { id: 2, name: "ProjectPlan.docx" },
//     { id: 3, name: "Presentation.pptx" },
//   ]);

//   const [sharedDocuments, setSharedDocuments] = useState([
//     { id: 101, name: "SharedReport.pdf" },
//     { id: 102, name: "TeamNotes.txt" },
//   ]);

//   const [uploadModalOpen, setUploadModalOpen] = useState(false);
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [snackbarMsg, setSnackbarMsg] = useState("");

//   const handleTabChange = (event, newValue) => {
//     setTab(newValue);
//   };

//   const handleFileChange = (e) => {
//     setSelectedFile(e.target.files[0]);
//   };

//   const handleUpload = () => {
//     if (!selectedFile) return;
//     const newDoc = {
//       id: Date.now(),
//       name: selectedFile.name,
//     };
//     setMyDocuments((docs) => [newDoc, ...docs]);
//     setSelectedFile(null);
//     setUploadModalOpen(false);
//     setSnackbarMsg(`Uploaded "${newDoc.name}" successfully.`);
//   };

//   const handleDelete = (id) => {
//     setMyDocuments((docs) => docs.filter((doc) => doc.id !== id));
//     setSnackbarMsg("Document deleted.");
//   };

//   const handleShare = (name) => {
//     alert(`Sharing document: ${name}`);
//   };

//   const handleDownload = (name) => {
//     alert(`Downloading document: ${name}`);
//   };

//   // Colors based on darkMode
//   const bgColor = darkMode ? "#121212" : "#fff";
//   const listItemBg = darkMode ? "#1e1e1e" : "#f9f9f9";
//   const listItemHoverBgMyDocs = darkMode ? "#333a44" : "#e3f2fd"; // Blueish hover
//   const listItemHoverBgSharedDocs = darkMode ? "#443a29" : "#fff8e1"; // Yellowish hover
//   const textPrimaryColor = darkMode ? "#fff" : "inherit";

//   return (
//     <Box
//       sx={{
//         width: "100%",
//         margin: "auto",
//         // bgcolor: bgColor,
//         color: textPrimaryColor,
//         borderRadius: 2,
//         // boxShadow: darkMode
//         //   ? "0 2px 8px rgb(255 255 255 / 0.1)"
//         //   : "0 2px 8px rgb(0 0 0 / 0.1)",
//       }}
//     >
//       <Typography variant="h5" sx={{padding:2, fontWeight: "bold" }}>
//         Documents
//       </Typography>

//       <Tabs
//         value={tab}
//         onChange={handleTabChange}
//         aria-label="document tabs"
//         textColor={darkMode ? "secondary" : "primary"}
//         indicatorColor={darkMode ? "secondary" : "primary"}
//         sx={{
//           borderBottom: darkMode ? "1px solid #444" : "1px solid #ddd",
//           mb: 2,
//           "& .MuiTab-root": {
//             color: darkMode ? "#bbb" : "inherit",
//           },
//           "& .Mui-selected": {
//             color: darkMode ? "#90caf9" : "#1976d2",
//             fontWeight: "bold",
//           },
//         }}
//       >
//         <Tab label="My Documents" />
//         <Tab label="Shared Documents" />
//       </Tabs>

//       <TabPanel value={tab} index={0}>
//         <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
//           <Button
//             variant="contained"
//             startIcon={<UploadFileIcon />}
//             onClick={() => setUploadModalOpen(true)}
//             sx={{
//               textTransform: "none",
//               fontWeight: "bold",
//               bgcolor: darkMode ? "#90caf9" : "#1976d2",
//               color: darkMode ? "#000" : "#fff",
//               "&:hover": {
//                 bgcolor: darkMode ? "#648dae" : "#115293",
//               },
//             }}
//           >
//             Upload Document
//           </Button>
//         </Box>

//         {myDocuments.length === 0 ? (
//           <Typography>No documents uploaded.</Typography>
//         ) : (
//           <List>
//             {myDocuments.map((doc) => (
//               <ListItem
//                 key={doc.id}
//                 sx={{
//                   mb: 1,
//                   borderRadius: 1,
//                    bgcolor: bgColor,
//                   "&:hover": { bgcolor: listItemHoverBgMyDocs },
//                   boxShadow: darkMode
//                     ? "0 1px 3px rgb(255 255 255 / 0.05)"
//                     : "0 1px 3px rgb(0 0 0 / 0.1)",
//                 }}
//                 secondaryAction={
//            <Box sx={{ display: 'flex', gap: 1 }}>
//                     <IconButton
//                       edge="end"
//                       aria-label="download"
//                       onClick={() => handleDownload(doc.name)}
//                       title="Download"
//                       sx={{ color: "#90caf9" }}
//                     >
//                       <DownloadIcon />
//                     </IconButton>
//                     <IconButton
//                       edge="end"
//                       aria-label="share"
//                       onClick={() => handleShare(doc.name)}
//                       title="Share"
//                       sx={{ color: "#66bb6a" }}
//                     >
//                       <ShareIcon />
//                     </IconButton>
//                     <IconButton
//                       edge="end"
//                       aria-label="delete"
//                       onClick={() => handleDelete(doc.id)}
//                       title="Delete"
//                       sx={{ color: "#ef5350" }}
//                     >
//                       <DeleteIcon />
//                     </IconButton>
//                   </Box>
//                 }
//               >
//                 <ListItemText
//                   primary={doc.name}
//                   primaryTypographyProps={{ fontWeight: "medium", color: textPrimaryColor }}
//                 />
//               </ListItem>
//             ))}
//           </List>
//         )}
//       </TabPanel>

//       <TabPanel value={tab} index={1}>
//         {sharedDocuments.length === 0 ? (
//           <Typography>No shared documents.</Typography>
//         ) : (
//           <List>
//             {sharedDocuments.map((doc) => (
//               <ListItem
//                 key={doc.id}
//                 sx={{
//                   mb: 1,
//                   borderRadius: 1,
//                    bgcolor: bgColor,
//                   "&:hover": { bgcolor: listItemHoverBgSharedDocs },
//                   boxShadow: darkMode
//                     ? "0 1px 3px rgb(255 255 255 / 0.05)"
//                     : "0 1px 3px rgb(0 0 0 / 0.1)",
//                 }}
//                 secondaryAction={
//                   <IconButton
//                     edge="end"
//                     aria-label="download"
//                     onClick={() => handleDownload(doc.name)}
//                     title="Download"
//                     sx={{ color: "#90caf9" }}
//                   >
//                     <DownloadIcon />
//                   </IconButton>
//                 }
//               >
//                 <ListItemText
//                   primary={doc.name}
//                   primaryTypographyProps={{ fontWeight: "medium", color: textPrimaryColor }}
//                 />
//               </ListItem>
//             ))}
//           </List>
//         )}
//       </TabPanel>

//       {/* Upload Document Modal */}
//       <Dialog
//         open={uploadModalOpen}
//         onClose={() => setUploadModalOpen(false)}
//         fullWidth
//         maxWidth="sm"
//         PaperProps={{
//           sx: {
//              bgcolor: bgColor,
//         color: textPrimaryColor,
//           },
//         }}
//       >
//         <DialogTitle>Upload New Document</DialogTitle>
//         <DialogContent>
//           <Input
//             type="file"
//             fullWidth
//             onChange={handleFileChange}
//             sx={{
//               color: darkMode ? "#eee" : "inherit",
//             }}
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button
//             onClick={() => setUploadModalOpen(false)}
//             color="secondary"
//             variant="outlined"
//           >
//             Cancel
//           </Button>
//           <Button
//             onClick={handleUpload}
//             variant="contained"
//             color="primary"
//             disabled={!selectedFile}
//           >
//             Upload
//           </Button>
//         </DialogActions>
//       </Dialog>

//       <Snackbar
//         open={Boolean(snackbarMsg)}
//         autoHideDuration={3000}
//         onClose={() => setSnackbarMsg("")}
//         message={snackbarMsg}
//       />
//     </Box>
//   );
// };

// export default DocumentManager;

import React, { useEffect, useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Input,
  Snackbar,
  TextField,
  MenuItem,
  TablePagination,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ShareIcon from "@mui/icons-material/Share";
import DownloadIcon from "@mui/icons-material/Download";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import {
  useDeleteUserDocument,
} from "./hook";
import { useGetUserAll } from "../AutoAttendance/hook";
import { getRequest, postRequest } from "../../../utils/apiClient";
import { showToast, ToastTypes } from "../../toast";
import ShareDocumentModal from "./ShareDocumentModal";

function TabPanel({ children, value, index, ...other }) {
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

const DocumentManager = ({ darkMode = false, userId }) => {
  const [currentPage, setCurrentPage] = useState(0); 
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalDocuments, setTotalDocuments] = useState(0); 

  const [tab, setTab] = useState(0);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareDocId, setShareDocId] = useState(null);
  const [shareUserId, setShareUserId] = useState("");
  const [shareEmail, setShareEmail] = useState("");
  const [alreadySharedUsers, setAlreadySharedUsers] = useState([]);
console.log("shareDocId",shareDocId);

  const [documentData, setDocumentData] = useState();
  const [sharedDocumentData, setSharedDocumentData] = useState(null);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(true);
  const [isLoadingSharedDocs, setIsLoadingSharedDocs] = useState(true);


  const DocumentData = documentData?.content;

  const SharedDocumentData = sharedDocumentData?.data;
  console.log("SharedDocumentData", SharedDocumentData);

  const { data: userListData } = useGetUserAll();
  const users = userListData?.data || [];

  const deleteUserDocument = useDeleteUserDocument();

  useEffect(() => {
    fetchUserDocuments();
    fetchSharedDocuments();
  }, []);

  useEffect(() => {
  if (shareDocId) {
    fetchSharedUsers();
  }
}, [shareDocId]);


const fetchSharedUsers = async () => {
  try {
    const { data } = await getRequest(`/api/document-sharing/users-for-document/${shareDocId}`);
    if (data?.data) {
      // Map to user list
      const allUsers = data.data.map((entry) => entry.user);

      // Deduplicate users by ID
      const uniqueUsers = [];
      const seenUserIds = new Set();

      for (const user of allUsers) {
        if (!seenUserIds.has(user.id)) {
          uniqueUsers.push(user);
          seenUserIds.add(user.id);
        }
      }

      setAlreadySharedUsers(uniqueUsers);
    }
  } catch (error) {
    console.error("Failed to fetch shared users", error);
  }
};


  useEffect(() => {
    fetchUserDocuments(currentPage, rowsPerPage);
  }, [currentPage, rowsPerPage]);

  
  const fetchUserDocuments = async (page = 0, perPage = 10) => {
    setIsLoadingDocuments(true);
    try {
      const { data } = await getRequest(
        `/api/documents/documents/${userId}?pageNo=${
          page + 1
        }&perPage=${perPage}`
      );
      if (data) {
        setDocumentData(data);
        setTotalDocuments(data.totalElements || 0);
      }
    } catch (err) {
      console.error("❌ Error fetching user documents", err);
    } finally {
      setIsLoadingDocuments(false);
    }
  };

  const fetchSharedDocuments = async () => {
    setIsLoadingSharedDocs(true);
    try {
      const { data } = await getRequest(
        `/api/document-sharing/shared-with-user/805`
      );
      if (data) {
        setSharedDocumentData(data);
      }
    } catch (err) {
      console.error("❌ Error fetching shared documents", err);
    } finally {
      setIsLoadingSharedDocs(false);
    }
  };

  const handleTabChange = (event, newValue) => setTab(newValue);
  const handleFileChange = (e) => setSelectedFile(e.target.files[0]);


  //handle file upload
  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      // Step 1: Upload file
      const formData = new FormData();
      formData.append("file", selectedFile);

      const uploadResponse = await fetch(
        "http://20.219.1.165:8090/api/documents/uploadFile",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!uploadResponse.ok) {
        throw new Error("File upload failed.");
      }

      const uploadResult = await uploadResponse.json();
      const filePath = uploadResult?.data?.filepath;

      if (!filePath) {
        throw new Error("No filepath returned from upload.");
      }

      // Step 2: Create document
      const createPayload = {
        fileName: selectedFile.name,
        filePath,
        fileType: selectedFile.name.split(".").pop().toLowerCase(),
        ownerId: userId,
      };

      const createResponse = await fetch(
        "http://20.219.1.165:8090/api/documents/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(createPayload),
        }
      );

      if (!createResponse.ok) {
        throw new Error("Document creation failed.");
      }

 if (typeof fetchUserDocuments === "function") fetchUserDocuments(currentPage, rowsPerPage);

      if (typeof fetchSharedDocuments === "function") fetchSharedDocuments();

      showToast(
        `Uploaded "${selectedFile.name}" successfully.`,
        ToastTypes.success
      );
      setSelectedFile(null);
      setUploadModalOpen(false);
    } catch (err) {
      showToast(err?.message || "Operation Failed", ToastTypes.error);
    }
  };


//handle delete
  const handleDelete = async (docId) => {
    try {
      await deleteUserDocument.mutateAsync({ documentId: docId, userId });

      fetchUserDocuments();
      fetchSharedDocuments();
    } catch (err) {}
  };



  const handleShare = (docId) => {
    setShareDocId(docId);
    setShareDialogOpen(true);
  };

  //document share handler
  const handleDocumentShare = async (docId, userIds, email) => {
    try {
      if (userIds && userIds.length > 0) {
        await postRequest(
          `/api/document-sharing/share-multiple?userIds=${userIds.join(
            ","
          )}&documentId=${docId}`
        );
      }

      if (email) {
        await postRequest(
          `/api/document-sharing/share-email?documentId=${docId}&email=${encodeURIComponent(
            email
          )}`
        );
      }

      showToast("Document shared successfully.", ToastTypes.success);
      fetchUserDocuments();
      fetchSharedDocuments();
    } catch (err) {
      showToast(err?.message || "Operation Failed", ToastTypes.error);
    }
  };


  //document download handler
  const handleDownload = async (filePath) => {
    console.log("filePath", filePath);

    if (!filePath) return;

    try {
      const response = await fetch(
        `http://20.219.1.165:8090/api/resources/serveFile?filePath=${filePath}`
      );

      if (!response.ok) {
        throw new Error("Failed to download file.");
      }

      const blob = await response.blob();
      const fileName = filePath.split("/").pop();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName || "download";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download file.");
    }
  };

  const bgColor = darkMode ? "#121212" : "#fff";
  const listItemHoverBgMyDocs = darkMode ? "#333a44" : "#e3f2fd";
  const listItemHoverBgSharedDocs = darkMode ? "#443a29" : "#fff8e1";
  const textPrimaryColor = darkMode ? "#fff" : "inherit";

  return (
    <Box sx={{ width: "100%", margin: "auto", color: textPrimaryColor }}>
      <Typography variant="h5" sx={{ p: 2, fontWeight: "bold" }}>
        Documents
      </Typography>

      <Tabs
        value={tab}
        onChange={handleTabChange}
        textColor={darkMode ? "secondary" : "primary"}
        indicatorColor={darkMode ? "secondary" : "primary"}
        sx={{
          borderBottom: darkMode ? "1px solid #444" : "1px solid #ddd",
          mb: 2,
        }}
      >
        <Tab label="My Documents" />
        <Tab label="Shared Documents" />
      </Tabs>

      <TabPanel value={tab} index={0}>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <Button
            variant="contained"
            startIcon={<UploadFileIcon />}
            onClick={() => setUploadModalOpen(true)}
            sx={{
              textTransform: "none",
              fontWeight: "bold",
              bgcolor: darkMode ? "#90caf9" : "#1976d2",
              color: darkMode ? "#000" : "#fff",
              "&:hover": { bgcolor: darkMode ? "#648dae" : "#115293" },
            }}
          >
            Upload Document
          </Button>
        </Box>

        {isLoadingDocuments ? (
          <Typography>Loading...</Typography>
        ) : DocumentData?.length === 0 ? (
          <Typography>No documents uploaded.</Typography>
        ) : (
          <>
            <List>
              {DocumentData.map((doc) => (
                <ListItem
                  key={doc.id}
                  sx={{
                    mb: 1,
                    borderRadius: 1,
                    bgcolor: bgColor,
                    "&:hover": { bgcolor: listItemHoverBgMyDocs },
                    boxShadow: darkMode
                      ? "1px 2px 3px rgb(255 255 255 / 0.05)"
                      : "1px 2px 3px rgb(0 0 0 / 0.1)",
                  }}
                  secondaryAction={
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <IconButton
                        onClick={() => handleDownload(doc.filePath)}
                        sx={{ color: "#90caf9" }}
                      >
                        <DownloadIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleShare(doc.id)}
                        sx={{ color: "#66bb6a" }}
                      >
                        <ShareIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(doc.id)}
                        sx={{ color: "#ef5350" }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  }
                >
                  <ListItemText
                    primary={doc.fileName}
                    primaryTypographyProps={{
                      fontWeight: "medium",
                      color: textPrimaryColor,
                    }}
                  />
                </ListItem>
              ))}
            </List>
            <TablePagination
              component="div"
              count={totalDocuments}
              page={currentPage}
              onPageChange={(event, newPage) => setCurrentPage(newPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(event) => {
                setRowsPerPage(parseInt(event.target.value, 10));
                setCurrentPage(0); // reset to first page
              }}
              rowsPerPageOptions={[5, 10, 25]}
            />
          </>
        )}
      </TabPanel>

      <TabPanel value={tab} index={1}>
        {isLoadingSharedDocs ? (
          <Typography>Loading...</Typography>
        ) : SharedDocumentData?.length === 0 ? (
          <Typography>No shared documents.</Typography>
        ) : (
          <List>
            {SharedDocumentData.map((doc) => (
              <ListItem
                key={doc.id}
                sx={{
                  mb: 1,
                  borderRadius: 1,
                  bgcolor: bgColor,
                  "&:hover": { bgcolor: listItemHoverBgSharedDocs },
                  boxShadow: darkMode
                    ? "0 1px 3px rgb(255 255 255 / 0.05)"
                    : "0 1px 3px rgb(0 0 0 / 0.1)",
                }}
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="download"
                    onClick={() => handleDownload(doc.filePath)}
                    title="Download"
                    sx={{ color: "#90caf9" }}
                  >
                    <DownloadIcon />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={doc.fileName}
                  primaryTypographyProps={{
                    fontWeight: "medium",
                    color: textPrimaryColor,
                  }}
                />
              </ListItem>
            ))}
          </List>
        )}
      </TabPanel>

      {/* Upload Modal */}
      <Dialog
        open={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Upload New Document</DialogTitle>
        <DialogContent>
          <Input
            type="file"
            fullWidth
            onChange={handleFileChange}
            sx={{ color: textPrimaryColor }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setUploadModalOpen(false)}
            variant="outlined"
            color="secondary"
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            variant="contained"
            color="primary"
            disabled={!selectedFile}
          >
            Upload
          </Button>
        </DialogActions>
      </Dialog>

      {/* Share Dialog */}
      <Dialog
        open={shareDialogOpen}
        onClose={() => setShareDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Share Document</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            select
            label="Select User"
            value={shareUserId}
            onChange={(e) => setShareUserId(e.target.value)}
            fullWidth
          >
            {users.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                {" "}
                {user.firstName} {user.lastName}
              </MenuItem>
            ))}
          </TextField>
          <Typography textAlign="center">OR</Typography>
          <TextField
            label="Email"
            type="email"
            value={shareEmail}
            onChange={(e) => setShareEmail(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShareDialogOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={() =>
              handleDocumentShare(
                shareDocId,
                shareUserId ? [shareUserId] : [],
                shareEmail
              )
            }
            disabled={!shareUserId && !shareEmail}
            variant="contained"
            color="primary"
          >
            Share
          </Button>
        </DialogActions>
      </Dialog>

      <ShareDocumentModal
  open={shareDialogOpen}
  onClose={() => setShareDialogOpen(false)}
  documentId={shareDocId}
 alreadySharedUsers={alreadySharedUsers}
  allUsers={users}
  onSharedSuccess={() => {
   fetchUserDocuments(currentPage, rowsPerPage);
    fetchSharedDocuments();
    fetchSharedUsers();
  }}
  darkMode={darkMode}
/>


      <Snackbar
        open={!!snackbarMsg}
        autoHideDuration={3000}
        onClose={() => setSnackbarMsg("")}
        message={snackbarMsg}
      />
    </Box>
  );
};

export default DocumentManager;
