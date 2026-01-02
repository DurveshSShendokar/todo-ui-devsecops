import React from "react";
// import "../ComponentStyle.css";

const Button = ({
  onClick,
  variant = "primary",
  size = "medium",
  leadingIcon,
  trailingIcon,
  children,
  className = "",
  ...props
}) => {
  const isDisabled = props.disabled ? "btn-disabled" : "";
  const classes = `button  btn-${variant} size-${size} ${isDisabled}  ${className}`;
  return (
    <button className={classes} onClick={onClick} {...props}>
      {leadingIcon && <span className="mr-2">{leadingIcon}</span>}
      {children}
      {trailingIcon && <span className="ml-2">{trailingIcon}</span>}
    </button>
  );
};

export default Button;
