
import { Box } from "@mui/material";
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";

const MainLayout = ({ children, darkMode, setDarkMode, isSidebarOpen, toggleSidebar }) => {
  return (
    <>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode}  />
      <Box sx={{ display: "flex" }}>
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} darkMode={darkMode} setDarkMode={setDarkMode}  />
       <Box
  component="main"
  sx={{
    flexGrow: 1,
    p: 2,
    marginTop: "65px", // Adjust to match your header
    transition: "margin-left 0.3s ease-in-out",
    minHeight: "calc(100vh - 65px)",
    overflowX: "hidden",
    backgroundColor: darkMode ? "#0a0a0a" : "#F5F5F5",
    marginLeft: {
      xs: 0, // No margin on mobile (sidebar overlays)
      md: isSidebarOpen ? "240px" : "70px", // Adjust to your sidebar widths
    },
  }}
>
  {children}
</Box>

      </Box>
    </>
  );
};

export default MainLayout;
