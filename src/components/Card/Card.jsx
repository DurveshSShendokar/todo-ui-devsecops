import React, { Children } from "react";
import "../ComponentStyle.css";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const Card = ({ ishover, children, className, ...props }) => {
  const addClass = className ? className : "";
  const hover = ishover ? "hover:bg-gray-100" : "";
  return (
    <>
      <div className={`card ${addClass} ${hover}`} {...props}>
        {children}
      </div>
    </>
  );
};

export default Card;
