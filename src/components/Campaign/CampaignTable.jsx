import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  useTheme,
} from "@mui/material";

const CampaignTable = ({ campaigns }) => {
  const theme = useTheme(); // Get current theme (Light/Dark)
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const isDarkMode = theme.palette.mode === "dark";

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div style={{ width: "100%", marginTop: "30px" }}>
      <Typography
        variant="h5"
        fontWeight="bold"
        textAlign="center"
        gutterBottom
        sx={{ mb: 2, color: isDarkMode ? "#90caf9" : "#1976d2" }}
      >
        🚀 Campaign List
      </Typography>

      <TableContainer
        sx={{
          maxWidth: "100%",
          maxHeight: "900px", // ✅ Increased height
          overflowY: "auto", // ✅ Enables scrolling
          borderRadius: "10px",
          border: isDarkMode ? "1px solid #555" : "1px solid #ddd",
        }}
      >
        <Table sx={{ minWidth: 1600, borderCollapse: "separate", borderSpacing: "0 10px" }}>
          <TableHead sx={{ position: "sticky", top: 0, zIndex: 2 }}>
            <TableRow sx={{ backgroundColor: isDarkMode ? "#333" : "#1976d2" }}>
              <TableCell sx={{ ...tableHeaderStyle, color: isDarkMode ? "#90caf9" : "white" }}>Campaign Name</TableCell>
              <TableCell sx={{ ...tableHeaderStyle, color: isDarkMode ? "#90caf9" : "white" }}>Product</TableCell>
              <TableCell sx={{ ...tableHeaderStyle, color: isDarkMode ? "#90caf9" : "white" }}>Industry</TableCell>
              <TableCell sx={{ ...tableHeaderStyle, color: isDarkMode ? "#90caf9" : "white" }}>Frequency</TableCell>
              <TableCell sx={{ ...tableHeaderStyle, color: isDarkMode ? "#90caf9" : "white" }}>Start Date</TableCell>
              <TableCell sx={{ ...tableHeaderStyle, color: isDarkMode ? "#90caf9" : "white" }}>End Date</TableCell>
              <TableCell sx={{ ...tableHeaderStyle, color: isDarkMode ? "#90caf9" : "white" }}>Campaign Heads</TableCell>
              <TableCell sx={{ ...tableHeaderStyle, color: isDarkMode ? "#90caf9" : "white" }}>Head Target </TableCell>
              <TableCell sx={{ ...tableHeaderStyle, color: isDarkMode ? "#90caf9" : "white" }}>Subhead Target </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {campaigns.length > 0 ? (
              campaigns.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((campaign) => (
                <TableRow
                  key={campaign.campaignId}
                  sx={{
                    backgroundColor: isDarkMode ? "#424242" : "#ffffff",
                    "&:nth-of-type(odd)": { backgroundColor: isDarkMode ? "#333" : "#f8f9fa" },
                    borderRadius: "10px",
                  }}
                >
                  <TableCell sx={tableCellStyle}>{campaign.campaignName}</TableCell>
                  <TableCell sx={tableCellStyle}>{campaign.productName}</TableCell>
                  <TableCell sx={tableCellStyle}>{campaign.industry || "N/A"}</TableCell>
                  <TableCell sx={tableCellStyle}>{campaign.frequency}</TableCell>
                  <TableCell sx={tableCellStyle}>{campaign.startDate}</TableCell>
                  <TableCell sx={tableCellStyle}>{campaign.endDate}</TableCell>
                  <TableCell sx={tableCellStyle}>
                    {campaign.campaignHeads?.length > 0 ? campaign.campaignHeads.join(", ") : "N/A"}
                  </TableCell>
                  <TableCell sx={tableCellStyle}>{campaign.campaignHeadTarget || "N/A"}</TableCell>
                  <TableCell sx={tableCellStyle}>{campaign.campaignSubheadTarget || "N/A"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ fontWeight: "bold", color: "red" }}>
                   No campaigns available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={campaigns.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          color: isDarkMode ? "#90caf9" : "inherit",
        }}
      />
    </div>
  );
};

const tableHeaderStyle = {
  fontWeight: "bold",
  fontSize: "16px",
  padding: "12px",
  textAlign: "center",
  backgroundColor: "#1976d2",
};

const tableCellStyle = {
  padding: "12px",
  fontSize: "14px",
  textAlign: "center",
  fontWeight: "500",
  borderBottom: "1px solid #ddd",
};

export default CampaignTable;