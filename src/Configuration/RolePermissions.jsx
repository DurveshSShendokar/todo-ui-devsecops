// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Typography,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Paper,
//   Checkbox,
//   Collapse,
//   IconButton,
//   ListItemText,
//   OutlinedInput,
//   Grid,
// } from "@mui/material";
// import ExpandLess from "@mui/icons-material/ExpandLess";
// import ExpandMore from "@mui/icons-material/ExpandMore";
// import axios from "axios";
// import { CategoryJson } from "../Context/CategoryJson";

// const RolePermissions = () => {
//   const [roles, setRoles] = useState([]);
//   const [selectedRoleId, setSelectedRoleId] = useState("");
//   const [openCategory, setOpenCategory] = useState({});
//   const [assignedPermissions, setAssignedPermissions] = useState([]);
//   const [selectedActions, setSelectedActions] = useState({});

//   useEffect(() => {
//     fetchRoles();
//   }, []);

//   const fetchRoles = async () => {
//     try {
//       const res = await axios.get("http://20.219.1.165:8090/access/getRoles");
//       if (Array.isArray(res.data)) {
//         setRoles(res.data);
//       }
//     } catch (error) {
//       console.error("Error fetching roles:", error);
//     }
//   };

//   const fetchRolePermissions = async (roleId) => {
//     try {
//       const res = await axios.get(`http://20.219.1.165:8090/access/getPermissionsAndActionByRole1?roleId=${roleId}`);
//       if (res.status === 200 && Array.isArray(res.data)) {
//         setAssignedPermissions(res.data.map((perm) => perm.permissionsName));
//         const initialActions = {};
//         res.data.forEach((perm) => {
//           initialActions[perm.permissionsName] = perm.actions || [];
//         });
//         setSelectedActions(initialActions);
//       } else {
//         setAssignedPermissions([]);
//         setSelectedActions({});
//       }
//     } catch (error) {
//       console.error("Error fetching permissions by role:", error);
//       setAssignedPermissions([]);
//       setSelectedActions({});
//     }
//   };

//   const handleRoleChange = (e) => {
//     const roleId = e.target.value;
//     setSelectedRoleId(roleId);
//     fetchRolePermissions(roleId);
//   };

//   const toggleCategory = (categoryName) => {
//     setOpenCategory((prev) => ({
//       ...prev,
//       [categoryName]: !prev[categoryName],
//     }));
//   };

//   const updateRolePermissionAction = async (roleId, permissionName, actions) => {
//     try {
//       await axios.post("http://20.219.1.165:8090/access/updateRolePermissionAction", {
//         roleId,
//         permissionName,
//         actions,
//       });
//       console.log(`Updated permission ${permissionName} for role ${roleId}`);
//     } catch (error) {
//       console.error("Error updating role permission action:", error);
//     }
//   };

//   const handlePermissionToggle = (permissionName, availableActions) => {
//     let updatedPermissions;
//     let updatedActions = { ...selectedActions };

//     if (assignedPermissions.includes(permissionName)) {
//       updatedPermissions = assignedPermissions.filter((p) => p !== permissionName);
//       updatedActions[permissionName] = [];
//     } else {
//       updatedPermissions = [...assignedPermissions, permissionName];
//       updatedActions[permissionName] = availableActions;
//     }

//     setAssignedPermissions(updatedPermissions);
//     setSelectedActions(updatedActions);
//     updateRolePermissionAction(selectedRoleId, permissionName, updatedActions[permissionName]);
//   };

//   const handleActionChange = (permissionName, selectedValues) => {
//     const updatedActions = {
//       ...selectedActions,
//       [permissionName]: selectedValues,
//     };
//     setSelectedActions(updatedActions);
//     updateRolePermissionAction(selectedRoleId, permissionName, selectedValues);
//   };

//   return (
//     <Box p={3}>
//       <Typography variant="h5" fontWeight="bold" color="purple" mb={3}>
//         Role Permission
//       </Typography>

//       <Paper elevation={3} sx={{ p: 3, backgroundColor: "#1B1F3B", color: "#FFF" }}>
//         <FormControl fullWidth sx={{ mb: 3 }}>
//           <InputLabel id="role-select-label" sx={{ color: "white" }}>
//             Choose a Role
//           </InputLabel>
//           <Select
//             labelId="role-select-label"
//             value={selectedRoleId}
//             onChange={handleRoleChange}
//             sx={{ backgroundColor: "#2A2D50", color: "white", ".MuiSvgIcon-root": { color: "white" } }}
//           >
//             {roles.map((role) => (
//               <MenuItem key={role.roleId} value={role.roleId}>
//                 {role.roleName}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>

//         {selectedRoleId && (
//           <Box>
//             {Object.entries(CategoryJson).map(([categoryName, permissions]) => (
//               <Box key={categoryName} mb={4}>
//                 <Box
//                   onClick={() => toggleCategory(categoryName)}
//                   display="flex"
//                   alignItems="center"
//                   justifyContent="space-between"
//                   sx={{ backgroundColor: "#2A2D50", p: 2, borderRadius: 1, mb: 1, cursor: "pointer" }}
//                 >
//                   <Typography variant="h6" fontWeight="bold" color="white">
//                     {categoryName}
//                   </Typography>
//                   <IconButton>
//                     {openCategory[categoryName] ? <ExpandLess sx={{ color: "white" }} /> : <ExpandMore sx={{ color: "white" }} />}
//                   </IconButton>
//                 </Box>

//                 <Collapse in={openCategory[categoryName]} timeout="auto" unmountOnExit>
//                   <Grid container spacing={2}>
//                     {permissions.map((perm) => (
//                       <Grid item xs={12} md={6} key={perm.permissionsName}>
//                         <Box
//                           sx={{
//                             backgroundColor: "#2A2D50",
//                             p: 2,
//                             borderRadius: 1,
//                             display: "flex",
//                             alignItems: "center",
//                             justifyContent: "space-between",
//                           }}
//                         >
//                           <Box display="flex" alignItems="center">
//                             <Checkbox
//                               checked={assignedPermissions.includes(perm.permissionsName)}
//                               onChange={() => handlePermissionToggle(perm.permissionsName, perm.actions)}
//                               sx={{ color: "white" }}
//                             />
//                             <Typography ml={1}>{perm.permissionsName}</Typography>
//                           </Box>

//                           <FormControl sx={{ minWidth: 180 }}>
//                             <Select
//                               multiple
//                               value={selectedActions[perm.permissionsName] || []}
//                               onChange={(e) => handleActionChange(perm.permissionsName, e.target.value)}
//                               input={<OutlinedInput />}
//                               renderValue={(selected) => selected.join(", ")}
//                               sx={{
//                                 backgroundColor: "#1B1F3B",
//                                 color: "white",
//                                 ".MuiSvgIcon-root": { color: "white" },
//                               }}
//                             >
//                               {perm.actions.map((action) => (
//                                 <MenuItem key={action} value={action}>
//                                   <Checkbox
//                                     checked={selectedActions[perm.permissionsName]?.includes(action)}
//                                   />
//                                   <ListItemText primary={action} />
//                                 </MenuItem>
//                               ))}
//                             </Select>
//                           </FormControl>
//                         </Box>
//                       </Grid>
//                     ))}
//                   </Grid>
//                 </Collapse>
//               </Box>
//             ))}
//           </Box>
//         )}
//       </Paper>
//     </Box>
//   );
// };

// export default RolePermissions;
