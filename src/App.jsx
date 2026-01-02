import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Outlet,
} from "react-router-dom";
import TodoList from "./components/todos/TodoList";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SignUpPage from "./components/SignUpPage";
import Login from "./components/login";
import { AuthProvider } from "./Context/AuthContext";

import ForgotPassword from "./components/ForgotPassword";
import { ThemeProvider, CssBaseline, Button } from "@mui/material";
import { darkTheme, lightTheme } from "./utils/DarkMode";
import { DarkModeProvider } from "./utils/DarkContext";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { Box } from "@mui/material";
import TodoDashboard from "./components/TodoDashboard";
import Product from "./components/Masters/Product";
import Company from "./components/Masters/Company";

import ActivityTargetUpdate from "./components/Campaign/ActivityTargetUpdate";
import CampaignLeadStatus from "./components/Campaign/CampaignLeadStatus";
import MqlStatus from "./components/Campaign/MqlStatus";
import SqlStatus from "./components/Campaign/SqlStatus";
import MainLayout from "./components/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import DealClose from "./components/Campaign/DealClose";
import LeadsDashboard from "./components/Campaign/LeadsDashboard";
import User from "./components/Campaign/User";
import Permission from "./Configuration/Permission";
import Role from "./Configuration/role";

import PermissionAction from "./Configuration/PermissionAction";
import { PermissionsProvider } from "./Context/permissionContext";
import CampaignStatusTabs from "./components/routes/CampaignStatus";
import ParsonnaTabs from "./components/routes/Personna";
import CampaignTabs from "./components/routes/Campaign";
import IndustryTabs from "./components/routes/Indusrty";
import ContactTabs from "./components/routes/Contact";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import RolePermission from "./Configuration/rolepermission";
import HolidayMaster from "./components/Hr/HolidayMatser";
import Attendance from "./components/Hr/UserAttendence";
import PermissionActionRoute from "./Configuration/permission-action";
import { PreviousPathProvider } from "./Context/BreadCrumbContext";
import AutoAttendance from "./components/Hr/AutoAttendance";
import AttendanceApprovalTabs from "./components/Hr/AttendenceAproval";
import AdminUserList from "./components/Hr/AdminAttendance";
import AttendanceReport from "./components/Hr/AttendanceReport";
import UserProfile from "./components/Hr/UserProfile";
import CummulativeReport from "./components/Hr/TaskReport";
import PrivacyPolicy from "./components/PrivacyPolicy";
import UploadDocumentsAdmin from "./components/Hr/UploadDocuments";
import UserLeaveDashboard from "./components/Hr/LeaveManagementUser";
import AdminLeavePanel from "./components/Hr/LeaveManagementAdmin";
import AdminLeaveManagement from "./components/Hr/LeaveManagementAdmin";
import PartnerMaster from "./components/Masters/PartnerMaster";
import ZioTeamsLanding from "./LandingPage";

const App = () => {
  const storedDarkMode = localStorage.getItem("darkMode") === "true";
  const [darkMode, setDarkMode] = useState(storedDarkMode);
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
    return () => {
      document.body.classList.remove("dark");
    };
  }, [darkMode]);

  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
        <CssBaseline />
        <PreviousPathProvider>
          <AuthProvider>
            <PermissionsProvider>
              <Router>
                <ToastContainer />

                <Routes>
                  <Route path="/" element={<ZioTeamsLanding />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signUp" element={<SignUpPage />} />
                  <Route path="/forgotPassword" element={<ForgotPassword />} darkMode={darkMode}/>
                  <Route
                    path="/privacyPolicy"
                    element={<PrivacyPolicy darkMode={darkMode} />}
                  />

                  <Route
                    path="/*"
                    element={
                      <ProtectedRoute>
                        <MainLayout
                          darkMode={darkMode}
                          setDarkMode={setDarkMode}
                          isSidebarOpen={isSidebarOpen}
                          toggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
                        >
                          <Routes>
                            <Route path="/dashboard">
                              <Route index element={<h1>Dashboard Page</h1>} />
                              <Route path="todo" element={<TodoList />} />
                              <Route
                                path="leads-dashboard"
                                element={<LeadsDashboard />}
                              />
                            </Route>

                           {/* Settings */}
                            <Route
                              path="/settings/partner"
                              element={<PartnerMaster darkMode={darkMode} />}
                            />
                            <Route
                              path="/settings/product"
                              element={<Product darkMode={darkMode} />}
                            />
                            <Route
                              path="/settings/industry"
                              element={<IndustryTabs darkMode={darkMode} />}
                            />
                            <Route
                              path="/settings/company"
                              element={<Company darkMode={darkMode} />}
                            />
                            {/* <Route path="/settings/persona" element={<Persona darkMode={darkMode} />} /> */}
                            <Route
                              path="/settings/campaign"
                              element={<CampaignTabs darkMode={darkMode} />}
                            />
                            {/* <Route path="/settings/campaign-head" element={<CampaignHead darkMode={darkMode} />} /> */}
                            <Route
                              path="/settings/contact"
                              element={<ContactTabs darkMode={darkMode} />}
                            />

                            <Route
                              path="/settings/Parsona"
                              element={<ParsonnaTabs darkMode={darkMode} />}
                            />
                            <Route
                              path="/settings/user-form"
                              element={<User darkMode={darkMode} />}
                            />

                            <Route
                              path="/campaign/activity-target-update"
                              element={
                                <ActivityTargetUpdate darkMode={darkMode} />
                              }
                            />
                            <Route
                              path="/campaign/status"
                              element={
                                <CampaignStatusTabs darkMode={darkMode} />
                              }
                            />

                            <Route
                              path="/campaign/leads-Dashboard"
                              element={<LeadsDashboard darkMode={darkMode} />}
                            />
                            <Route
                              path="/Hr/holiday"
                              element={<HolidayMaster darkMode={darkMode} />}
                            />
                            <Route
                              path="/Hr/attendance"
                              element={<Attendance darkMode={darkMode} />}
                            />
                            <Route
                              path="/Hr/auto-attendance"
                              element={<AutoAttendance darkMode={darkMode} />}
                            />
                            <Route
                              path="/Hr/attendance-aproval"
                              element={
                                <AttendanceApprovalTabs darkMode={darkMode} />
                              }
                            />
                            <Route
                              path="/Hr/attendance-admin"
                              element={<AdminUserList darkMode={darkMode} />}
                            />
                            <Route
                              path="/Hr/attendance-report"
                              element={<AttendanceReport darkMode={darkMode} />}
                            />
                            <Route
                              path="/Hr/task-report"
                              element={
                                <CummulativeReport darkMode={darkMode} />
                              }
                            />

                            <Route
                              path="/configuration/permission"
                              element={<Permission darkMode={darkMode} />}
                            />
                            <Route
                              path="/configuration/role"
                              element={<Role darkMode={darkMode} />}
                            />

                            <Route
                              path="/configuration/role-permission"
                              element={<RolePermission darkMode={darkMode} />}
                            />
                            <Route
                              path="/configuration/permission-action"
                              element={
                                <PermissionActionRoute darkMode={darkMode} />
                              }
                            />
                            <Route
                              path="/profile"
                              element={<UserProfile darkMode={darkMode} />}
                            />
                             <Route
                              path="/upload-documents"
                              element={<UploadDocumentsAdmin darkMode={darkMode} />}
                            />

                              <Route
                              path="/leave-management-user"
                              element={<UserLeaveDashboard darkMode={darkMode} />}
                            />

                              <Route
                              path="/leave-management-manager"
                              element={<AdminLeaveManagement darkMode={darkMode} />}
                            />
                          </Routes>
                        </MainLayout>
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </Router>
            </PermissionsProvider>
          </AuthProvider>
        </PreviousPathProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
