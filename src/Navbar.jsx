import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Avatar,
  Tooltip,
  IconButton,
  useMediaQuery,
  useTheme,
  Box,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import SearchCommandDialog from "./searchDialog";
import SearchIcon from "@mui/icons-material/Search";

const Navbar = ({ darkMode, setDarkMode }) => {
  const navigate = useNavigate();
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [searchOpen, setSearchOpen] = useState(false); 
  const handleLogout = () => {
    sessionStorage.removeItem("userDetails");
    localStorage.removeItem("userDetails");
    navigate("/login");
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const userDetails = JSON.parse(sessionStorage.getItem("userDetails")) || {};
  const firstName = userDetails.firstName || "";
  const lastName = userDetails.lastName || "";

  const getInitials = () => {
    return ((firstName[0] || "") + (lastName[0] || "")).toUpperCase();
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        backgroundColor: darkMode ? "#000" : "#FFFFFF",
        color: darkMode ? "#E0E0E0" : "#1B1F3B",
        boxShadow: darkMode
          ? "0 1px 4px rgba(255, 255, 255, 0.1)"
          : "0 1px 4px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Toolbar sx={{ display: "flex", alignItems: "center" }}>
        {/* Logo (hidden on mobile) */}
        {!isMobile && (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <img
              src="/images/logo-02.png"
              alt="Logo"
              style={{
                height: 36,
                width: "auto",
                filter: darkMode ? "invert(1) brightness(2)" : "none",
                  marginLeft: "30px",
              }}
            />
          </Box>
        )}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            marginLeft: "auto",
          }}
        >
          <Box
      onClick={() => setSearchOpen(true)}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        borderRadius: 1,
        px: 2,
        py: 1,
       border: (theme) =>
        darkMode
          ? `1px solid ${theme.palette.grey[700]}`
          : `1px solid ${theme.palette.grey[300]}`,
      backgroundColor: (theme) =>
        darkMode ? theme.palette.background.default : theme.palette.background.paper,
        cursor: "pointer",
        width: 250,
        transition: "0.2s",
          "&:hover": {
        boxShadow: 1,
        backgroundColor: (theme) =>
          darkMode ? theme.palette.action.hover : "#f5f5f5",
      },
      }}
    >
      <SearchIcon fontSize="small" sx={{ color: "text.secondary" }} />
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ flexGrow: 1 }}
      >
        Search (Ctrl + K)
      </Typography>
      <Box
        sx={{
          borderRadius: "4px",
          border: "1px solid #ccc",
          px: 0.8,
          fontSize: "0.75rem",
          fontWeight: 500,
          color: "#666",
          backgroundColor: "#fafafa",
        }}
      >
        K
      </Box>
    </Box>


          <Button
            onClick={() => setDarkMode(!darkMode)}
            sx={{
              color: darkMode ? "#E0E0E0" : "#1B1F3B",
              minWidth: isMobile ? "auto" : undefined,
              px: isMobile ? 1 : 2,
            }}
          >
            {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
            {/* {!isMobile && (darkMode ? "Light Mode" : "Dark Mode")} */}
          </Button>

          {/* Profile Avatar */}
          <Tooltip title="Profile">
            <IconButton onClick={handleProfileClick}>
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: "primary.main",
                  fontSize: 14,
                }}
                src={userDetails.profileImage || ""}
                alt="Profile"
              >
                {getInitials()}
              </Avatar>
            </IconButton>
          </Tooltip>

          {/* Logout Button */}
          <Button
            onClick={handleLogout}
            sx={{
              color: darkMode ? "#E0E0E0" : "#1B1F3B",
              "&:hover": { color: "blue" },
            }}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
      <SearchCommandDialog open={searchOpen} setOpen={setSearchOpen} />

    </AppBar>
  );
};

export default Navbar;
