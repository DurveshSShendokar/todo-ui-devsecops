import React, { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Divider,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import { usePermissions } from "./Context/permissionContext";

// Icons
import SettingsIcon from "@mui/icons-material/Settings";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ReportIcon from "@mui/icons-material/Assessment";
import AppsIcon from "@mui/icons-material/Apps";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
const getCategoryIcon = (category) => {
  const normalized = category?.toLowerCase();

  switch (normalized) {
    case "configuration":
      return <SettingsIcon fontSize="small" sx={{ color: "#1976d2" }} />; // Blue
    case "dashboard":
      return <DashboardIcon fontSize="small" sx={{ color: "#43a047" }} />; // Green
    case "report":
      return <ReportIcon fontSize="small" sx={{ color: "#fb8c00" }} />; // Orange
    case "transaction":
      return <AssignmentIcon fontSize="small" sx={{ color: "#8e24aa" }} />; // Purple
    case "master":
      return <AppsIcon fontSize="small" sx={{ color: "#5c6bc0" }} />; // Indigo
    case "hr":
      return <EventAvailableIcon fontSize="small" sx={{ color: "#e53935" }} />; // Red
    default:
      return <AppsIcon fontSize="small" sx={{ color: "#757575" }} />; // Grey
  }
};


const SearchCommandDialog = ({ open, setOpen }) => {
  const navigate = useNavigate();
  const { routes } = usePermissions();
  const [searchTerm, setSearchTerm] = useState("");

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      const isMac = navigator.platform.toUpperCase().includes("MAC");
      const isK = e.key.toLowerCase() === "k";

      if ((isMac && e.metaKey && isK) || (!isMac && e.ctrlKey && isK)) {
        e.preventDefault();
        setOpen(true);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setOpen]);

  // Group permissions
  const groupedPermissions = useMemo(() => {
    if (!routes) return {};

    const sections = [
      "masterPermission",
      "configurationPermission",
      "dashboardPermission",
      "reportPermission",
      "transactionPermission",
      "hrPermission",
    ];

    const all = sections.flatMap((key) => routes[key] || []).filter((p) => p.selected);

    const filtered = all.filter((item) =>
      item.permissionsName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filtered.reduce((acc, item) => {
      const category = item.category || "Other";
      if (!acc[category]) acc[category] = [];
      acc[category].push(item);
      return acc;
    }, {});
  }, [routes, searchTerm]);

  const handleNavigate = (path) => {
    setOpen(false);
    navigate(path);
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 3, pt: 2 }}>
        <DialogTitle sx={{ m: 0, p: 0 }}>🔍 Search Your Screen</DialogTitle>
        <IconButton onClick={() => setOpen(false)} size="small">
          <CloseIcon />
        </IconButton>
      </Box>
      <DialogContent
        sx={{
          maxHeight: "420px",
          overflowY: "auto",
          pt: 1,
          // 👇 Custom scrollbar styling
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {
            background: "#f1f1f1",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#888",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: "#555",
          },
        }}
      >
        <TextField
          autoFocus
          fullWidth
          placeholder="Type to search..."
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 2 }}
        />

        {Object.keys(groupedPermissions).length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No results found.
          </Typography>
        ) : (
          Object.entries(groupedPermissions).map(([category, items]) => (
            <Box key={category} sx={{ mb: 2 }}>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                sx={{ pl: 1.5, mb: 0.5 }}
              >
                {category}
              </Typography>
              <List disablePadding dense>
                {items.map((item) => (
                  <ListItemButton
                    key={item.permissionsId}
                    onClick={() => handleNavigate(item.navigationUrl)}
                  >
                    <ListItemIcon>{getCategoryIcon(category)}</ListItemIcon>
                    <ListItemText primary={item.permissionsName} />
                  </ListItemButton>
                ))}
              </List>
              <Divider sx={{ mt: 1 }} />
            </Box>
          ))
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SearchCommandDialog;
