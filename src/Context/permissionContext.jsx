import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { CategoryJson } from "./CategoryJson";
import { fetchData, getRequest } from "../utils/apiClient"; 
import { useGetPermissionsAndActionsByRole } from "./hook";

const PermissionsContext = createContext(undefined);

export const PermissionsProvider = ({ children }) => {
  const { state } = useAuth();
  const [routes, setRoutes] = useState();

  console.log("routes",routes);
  
  const [roleId, setRoleId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
console.log("roleId",roleId);

  useEffect(() => {
    const userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
    if (userDetails) {
      setRoleId(userDetails?.role?.roleId?.toString() || null);
      setUserId(userDetails?.id?.toString() || null);
      console.log(userDetails);
      
    }
  }, [state?.isAuthenticated]);

  // useEffect(() => {
  //   const fetchPermissions = async () => {
  //     if (roleId ) {
  //       try {
  //         const res = await fetchData(`/access/getPermissionsAndActionByRole1?roleId=${roleId}`);
  //         console.log("res",res);
  //          setRoutes(res.data );
         
  //       } catch (err) {
  //         console.error("Error fetching permissions:", err);
  //         setRoutes({});
  //       } finally {
  //         setLoading(false);
  //       }
  //     } else {
  //       setLoading(false);
  //     }
  //   };

  //   fetchPermissions();
  // }, [roleId]);

  const userHasPermission = (url) => {
    return Object.values(routes).some((category) =>
      category.some((route) => route.navigationUrl === url)
    );
  };



    const { data, isLoading } = useGetPermissionsAndActionsByRole(roleId);
console.log("data",data);

  // Set routes once data is available
  useEffect(() => {
    if (data) {
      setRoutes(data);
    }
  }, [data]);


  return (
    <PermissionsContext.Provider
      value={{
        routes,
        setRoutes,
        userHasPermission,
        roleId,
        userId,
        loading,
      }}
    >
      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
          <div className="w-16 h-16 border-4 border-t-4 border-gray-300 border-t-violet-500 rounded-full animate-spin">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : (
        children
      )}
    </PermissionsContext.Provider>
  );
};

export const usePermissions = () => {
  const context = useContext(PermissionsContext);
  if (!context) {
    throw new Error("usePermissions must be used within a PermissionsProvider");
  }
  return context;
};
export default PermissionsContext;