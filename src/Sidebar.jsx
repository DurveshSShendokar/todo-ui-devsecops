
// import React, { useState } from "react";
// import {
//   Drawer,
//   List,
//   ListItem,
//   ListItemButton,
//   ListItemIcon,
//   ListItemText,
//   Collapse,
//   IconButton,
//   Box,
// } from "@mui/material";
// import DashboardIcon from "@mui/icons-material/Dashboard";
// import CampaignIcon from "@mui/icons-material/Campaign";
// import SettingsIcon from "@mui/icons-material/Settings";
// import BusinessIcon from "@mui/icons-material/Business";
// import PersonIcon from "@mui/icons-material/Person";
// import AccountTreeIcon from "@mui/icons-material/AccountTree";
// import ListIcon from "@mui/icons-material/List";
// import ExpandLess from "@mui/icons-material/ExpandLess";
// import ExpandMore from "@mui/icons-material/ExpandMore";
// import MenuOpenIcon from "@mui/icons-material/MenuOpen";
// import MenuIcon from "@mui/icons-material/Menu";
// import { useNavigate } from "react-router-dom";
// import { usePermissions } from "./Context/permissionContext";

// const Sidebar = ({ isOpen, toggleSidebar, darkMode }) => {
//   const navigate = useNavigate();
//   const { routes } = usePermissions();
//   const [openMenu, setOpenMenu] = useState(null); // Only one submenu should be open at a time

//   const primaryTextColor = darkMode ? "#E0E0E0" : "#1B1F3B";
//   const activeTextColor = darkMode ? "#FFD700" : "#1976D2";
//   const drawerBgColor = darkMode ? "#000" : "#FFFFFF";
//   const drawerBorderColor = darkMode ? "#000" : "#F0F0F0";
//   const scrollbarTrackColor = darkMode ? "#2A2D50" : "#F0F0F0";

//   const getIconByCategory = (category) => {
//     switch (category.toLowerCase()) {
//       case "dashboard":
//         return <DashboardIcon />;
//       case "transaction":
//         return <CampaignIcon />;
//       case "master":
//         return <SettingsIcon />;
//       case "hr":
//         return <PersonIcon />;
//       case "configuration":
//         return <AccountTreeIcon />;
//       default:
//         return <ListIcon />;
//     }
//   };

//   const getSidebarMenuFromRoutes = (routes) => {
//     if (!routes || typeof routes !== "object") return [];

//     return Object.entries(routes)
//       .filter(([_, perms]) => Array.isArray(perms) && perms.length > 0) // Ensure valid perms
//       .map(([key, perms]) => {
//         const categoryName = perms[0]?.category || key;
//         const selectedPerms = perms.filter((perm) => perm.selected);

//         if (selectedPerms.length === 0) return null;

//         return {
//           text: categoryName,
//           icon: getIconByCategory(categoryName),
//           submenu: selectedPerms.map((perm) => ({
//             text: perm.permissionsName,
//             path: perm.navigationUrl,
//           })),
//         };
//       })
//       .filter((menu) => menu !== null); // Remove null entries
//   };

//   const dynamicMenu = getSidebarMenuFromRoutes(routes);

//   const handleToggle = (text) => {
//     // If the clicked submenu is already open, close it, else open it and close the others
//     setOpenMenu(openMenu === text ? null : text);
//   };

//   return (
//     <Drawer
//       variant="permanent"
//       anchor="left"
//       open={isOpen}
//       sx={{
//         "& .MuiDrawer-paper": {
//           width: isOpen ? 240 : 70,
//           transition: "width 0.3s ease-in-out",
//           backgroundColor: drawerBgColor,
//           color: primaryTextColor,
//           borderRight: `1px solid ${drawerBorderColor}`,
//           height: "100vh",
//           position: "fixed",
//           paddingTop: "20px",
//           top: "65px",
//           overflowY: "auto",
//           "&::-webkit-scrollbar": { width: "2px" },
//           "&::-webkit-scrollbar-track": { background: scrollbarTrackColor },
//           "&::-webkit-scrollbar-thumb": {
//             background: "#FFD700",
//             borderRadius: "5px",
//             "&:hover": { background: "#FFB300" },
//           },
//         },
//       }}
//     >
//       <List>
//         {dynamicMenu.map((item) => (
//           <React.Fragment key={item.text}>
//             <ListItem disablePadding>
//               <ListItemButton
//                 onClick={() => handleToggle(item.text)}
//                 sx={{
//                   display: "flex",
//                   justifyContent: "flex-start",
//                   alignItems: "center",
//                   paddingLeft: isOpen ? 2 : 2,
//                   paddingRight: isOpen ? 2 : 2,
//                 }}
//               >
//                 <ListItemIcon
//                   onClick={() => {
//                     if (!isOpen) {
//                       toggleSidebar();
//                     }
//                   }}
//                   sx={{
//                     minWidth: "auto",
//                     marginRight: isOpen ? 1 : 0,
//                   }}
//                 >
//                   {item.icon}
//                 </ListItemIcon>

//                 {/* Only show text when the sidebar is open */}
//                 {isOpen && (
//                   <ListItemText primary={item.text} sx={{ marginLeft: 1 }} />
//                 )}
//                 {item.submenu?.length > 0 &&
//                   (openMenu === item.text ? <ExpandLess /> : <ExpandMore />)}
//               </ListItemButton>
//             </ListItem>

//             {/* Show submenu on toggle when sidebar is open */}
//             {isOpen && (
//               <Collapse
//                 in={openMenu === item.text}
//                 timeout="auto"
//                 unmountOnExit
//               >
//                 <List component="div" disablePadding sx={{  }}>
//                   {item.submenu.map((subItem) => (
//                     <ListItem key={subItem.text} disablePadding>
//                       <ListItemButton
//                         onClick={() => navigate(subItem.path)}
//                         sx={{
                          
//                           pl: 4,
//                           color:
//                             location.pathname === subItem.path
//                               ? activeTextColor
//                               : primaryTextColor,
//                           "&:hover": { color: activeTextColor },
                          
//                         }}
//                       >
//                         <ListItemText primary={subItem.text} sx={{ ml: 4 }} />
//                       </ListItemButton>
//                     </ListItem>
//                   ))}
//                 </List>
//               </Collapse>
//             )}
//           </React.Fragment>
//         ))}
//       </List>
 
//       <IconButton
//         onClick={toggleSidebar}
//         sx={{
//           position: "fixed",
//           bottom: 20,
//           left: isOpen ? "200px" : "15px",
//           backgroundColor: darkMode ? "#202020" : "#E0E0E0",
//           color: darkMode ? "#FFD700" : "#1B1F3B",
//           "&:hover": {
//             backgroundColor: darkMode ? "#3A3F5A" : "#D0D0D0",
//           },
//         }}
//       >
//         {isOpen ? <MenuOpenIcon /> : <MenuIcon />}
//       </IconButton>
//     </Drawer>
//   );
// };

// export default Sidebar;




import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  IconButton,
  Box,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CampaignIcon from "@mui/icons-material/Campaign";
import SettingsIcon from "@mui/icons-material/Settings";
import BusinessIcon from "@mui/icons-material/Business";
import PersonIcon from "@mui/icons-material/Person";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import ListIcon from "@mui/icons-material/List";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import { usePermissions } from "./Context/permissionContext";

const Sidebar = ({ isOpen, toggleSidebar, darkMode }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { routes } = usePermissions();
  const [openMenu, setOpenMenu] = useState(null);

  const primaryTextColor = darkMode ? "#E0E0E0" : "#1B1F3B";
  const activeTextColor = darkMode ? "#FFD700" : "#1976D2";
  const drawerBgColor = darkMode ? "#000" : "#FFFFFF";
  const drawerBorderColor = darkMode ? "#000" : "#F0F0F0";
  const scrollbarTrackColor = darkMode ? "#2A2D50" : "#F0F0F0";

  const getIconByCategory = (category) => {
    switch (category.toLowerCase()) {
      case "dashboard":
        return <DashboardIcon />;
      case "transaction":
        return <CampaignIcon />;
      case "master":
        return <SettingsIcon />;
      case "hr":
        return <PersonIcon />;
      case "configuration":
        return <AccountTreeIcon />;
      default:
        return <ListIcon />;
    }
  };

  const getSidebarMenuFromRoutes = (routes) => {
    if (!routes || typeof routes !== "object") return [];
    return Object.entries(routes)
      .filter(([_, perms]) => Array.isArray(perms) && perms.length > 0)
      .map(([key, perms]) => {
        const categoryName = perms[0]?.category || key;
        const selectedPerms = perms.filter((perm) => perm.selected);
        if (selectedPerms.length === 0) return null;
        return {
          text: categoryName,
          icon: getIconByCategory(categoryName),
          submenu: selectedPerms.map((perm) => ({
            text: perm.permissionsName,
            path: perm.navigationUrl,
          })),
        };
      })
      .filter((menu) => menu !== null);
  };

  const dynamicMenu = getSidebarMenuFromRoutes(routes);

  const handleToggle = (text) => {
    setOpenMenu(openMenu === text ? null : text);
  };

  return (
    <>
     {isMobile && (
  <IconButton
    onClick={toggleSidebar}
    sx={{
      position: "fixed",
      top: 10, // Closer to top of screen
      left: 10,
      zIndex: 1300,
      backgroundColor: darkMode ? "#202020" : "#E0E0E0",
      color: darkMode ? "#FFD700" : "#1B1F3B",
      "&:hover": {
        backgroundColor: darkMode ? "#3A3F5A" : "#D0D0D0",
      },
    }}
  >
    <MenuIcon />
  </IconButton>
)}


 <Drawer
  variant={isMobile ? "temporary" : "permanent"}
  anchor="left"
  open={isMobile ? isOpen : true}
  onClose={isMobile ? toggleSidebar : undefined}
  ModalProps={{ keepMounted: true }}
  sx={{
    zIndex: isMobile ? 1301 : 'auto', 
    "& .MuiDrawer-paper": {
      width: isMobile ? 240 : isOpen ? 240 : 70,
      transition: "width 0.3s ease-in-out",
      backgroundColor: drawerBgColor,
      color: primaryTextColor,
      borderRight: `1px solid ${drawerBorderColor}`,
      height: "100vh",
      top: isMobile ? 0 : "65px", 
      position: isMobile ? "fixed" : "fixed",
      overflowY: "auto",
      paddingBottom: "120px",
      "&::-webkit-scrollbar": { width: "2px" },
      "&::-webkit-scrollbar-track": { background: scrollbarTrackColor },
      "&::-webkit-scrollbar-thumb": {
        background: "#FFD700",
        borderRadius: "5px",
        "&:hover": { background: "#FFB300" },
      },
    },
  }}
>
{(isMobile) && (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "64px",
        px: 2,
        py: 1,
        borderBottom: `1px solid ${drawerBorderColor}`,
      }}
    >
      <img
        src="/images/logo-02.png"
        alt="Logo"
        style={{
          height: 32,
          objectFit: "contain",
          filter: darkMode ? "invert(1) brightness(2)" : "none",
        }}
      />
    </Box>

  )}
  
        <List>
          {dynamicMenu.map((item) => (
            <React.Fragment key={item.text}>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => handleToggle(item.text)}
                  sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    paddingLeft: isOpen ? 2 : 2,
                    paddingRight: isOpen ? 2 : 2,
                  }}
                >
                  <ListItemIcon
                    onClick={() => {
                      if (!isOpen && !isMobile) {
                        toggleSidebar();
                      }
                    }}
                    sx={{ minWidth: "auto", marginRight: isOpen ? 1 : 0 }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {isOpen && <ListItemText primary={item.text} sx={{ marginLeft: 1 }} />}
                  {item.submenu?.length > 0 &&
                    (openMenu === item.text ? <ExpandLess /> : <ExpandMore />)}
                </ListItemButton>
              </ListItem>

              {isOpen && (
                <Collapse in={openMenu === item.text} timeout="auto" unmountOnExit>
                  
                  <List component="div" disablePadding>
                    {item.submenu.map((subItem) => (
                      <ListItem key={subItem.text} disablePadding>
                        <ListItemButton
                          onClick={() => navigate(subItem.path)}
                          sx={{
                            pl: 4,
                            color: window.location.pathname === subItem.path ? activeTextColor : primaryTextColor,
                            "&:hover": { color: activeTextColor },
                          }}
                        >
                          <ListItemText primary={subItem.text} sx={{ ml: 4 }} />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              )}
            </React.Fragment>
          ))}
        </List>

        {!isMobile && (
          <IconButton
            onClick={toggleSidebar}
            sx={{
              position: "fixed",
              bottom: 20,
              left: isOpen ? "200px" : "15px",
              backgroundColor: darkMode ? "#202020" : "#E0E0E0",
              color: darkMode ? "#FFD700" : "#1B1F3B",
              "&:hover": {
                backgroundColor: darkMode ? "#3A3F5A" : "#D0D0D0",
              },
            }}
          >
            {isOpen ? <MenuOpenIcon /> : <MenuIcon />}
          </IconButton>
        )}
      </Drawer>
    </>
  );
};

export default Sidebar;
