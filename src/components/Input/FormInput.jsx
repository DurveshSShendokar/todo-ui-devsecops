import React from "react";
import "../ComponentStyle.css";

function FormInput({
  htmlFor,
  name,
  label,
  value,
  onChange,
  placeholder,
  type,
  inputIcon,
  className = "",
  ...props
}) {
  const iconClass = inputIcon ? "ps-10" : "";

  return (
    <>
      {label && (
        <label htmlFor={htmlFor} className="input-label">
          {label}
        </label>
      )}
      <div className={`relative mb-4 ${className}`}>
        {inputIcon && (
          <div className="absolute inset-y-0 start-0 flex items-center justify-center ps-3 pointer-events-none">
            {inputIcon}
          </div>
        )}

        <input
          {...props}
          className={`focus:outline-none input-field ${iconClass}`}
          id={htmlFor}
          name={name}
          onChange={onChange}
          placeholder={placeholder}
          type={type}
          value={value}
        />
      </div>
    </>
  );
}

export default FormInput;
