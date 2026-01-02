import React, { createContext, useContext, useReducer } from "react";

const AuthContext = createContext();

const userDetails = JSON.parse(sessionStorage.getItem("userDetails"));

const initialState = {
  isAuthenticated: !!userDetails,
  user: userDetails || null,
  redirectCount: 0,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
      };
    case "LOGOUT":
      sessionStorage.removeItem("userDetails");
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        redirectCount: 0, // Optional reset
      };
    case "INCREMENT_REDIRECT_COUNT":
      return {
        ...state,
        redirectCount: state.redirectCount + 1,
      };
    default:
      return state;
  }
};

const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { AuthProvider, useAuth };
