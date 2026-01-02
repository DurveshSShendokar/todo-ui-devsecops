import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Input } from "@nextui-org/react";

const AddRoleForm = ({ defaultValues, formId, onSubmit }) => {
  const { theme } = useTheme();
  const inputVariant = theme === "dark" ? "bordered" : "faded";

  // Initialize state with defaultValues.roleName if available
  const [name, setName] = useState(defaultValues?.roleName || "");

  useEffect(() => {
    // Update state when defaultValues change
    if (defaultValues?.roleName) {
      setName(defaultValues.roleName);
    }
  }, [defaultValues]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      roleName: name,
      active: 1,
    };
    onSubmit(data);
  };

  const handleNameChange = (e) => {
    setName(e.target.value); // Update the state with the new value
  };

  return (
    <form id={formId} onSubmit={handleSubmit} className="space-y-4">
      <Input
        variant={inputVariant}
        isRequired
        label="Name"
        placeholder="Enter Name"
        value={name} // Use the state value for the input field
        onChange={handleNameChange} // Update the state when the value changes
        isDisabled={false} // Make the input editable
      />
    </form>
  );
};

export default AddRoleForm;
