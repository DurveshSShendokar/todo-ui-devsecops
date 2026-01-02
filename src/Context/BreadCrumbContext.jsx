// src/context/PreviousPathContext.js
import React, { createContext, useState, useContext, useEffect } from "react";


// Create a Context for the previous path
const PreviousPathContext = createContext();

// Create a custom hook to use the previous path context
export const usePreviousPath = () => {
  return useContext(PreviousPathContext);
};

// Context Provider Component
export const PreviousPathProvider = ({ children }) => {
  const [previousPath, setPreviousPath] = useState(null);



  return (
    <PreviousPathContext.Provider value={{ previousPath, setPreviousPath }}>
      {children}
    </PreviousPathContext.Provider>
  );
};
