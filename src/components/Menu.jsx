import * as React from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

export default function PositionedMenu({
  label,
  task,
  currentStatus,
  onStatusChange,
}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const getAccentColor = () => {
    if (currentStatus === "todo") return "accent-blue-700";
    if (currentStatus === "completed") return "accent-green-700";
    return "accent-black";
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setTimeout(() => {
      setAnchorEl(null);
    }, 200);
  };

  const handleChange = (e) => {
    const targetValue = e.target.value;
    onStatusChange(task, targetValue);
  };

  return (
    <div>
      <div className="flex items-center cursor-pointer">
        <input
          type="radio"
          id={`status-radio-${task.taskId}`}
          value={currentStatus}
          checked
          onClick={handleClick}
          className={`h-4 w-4 ${getAccentColor()}`}
          readOnly
        />
        <label
          htmlFor={`status-radio-${task.taskId}`}
          className="ml-4 text-gray-800 dark:text-gray-200"
        >
          {label}
        </label>
      </div>

      <Menu
        id="demo-positioned-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        PaperProps={{
          sx: {
            backgroundColor: (theme) =>
              theme.palette.mode === "dark" ? "#1e1e1e" : "#fff",
            color: (theme) =>
              theme.palette.mode === "dark" ? "#e0e0e0" : "#000",
          },
        }}
      >
        {[
          { value: "todo", label: "Todo", color: "accent-blue-700" },
          { value: "inprogress", label: "Inprogress", color: "accent-black" },
          { value: "completed", label: "Completed", color: "accent-green-700" },
        ].map((status, index) => (
          <MenuItem key={index} onClick={handleClose}>
            <input
              type="radio"
              id={`status-${status.value}-${task.taskId}`}
              name={`status-${task.taskId}`}
              value={status.value}
              checked={currentStatus === status.value}
              onChange={handleChange}
              className={`mr-2 ${status.color}`}
            />
            <label
              htmlFor={`status-${status.value}-${task.taskId}`}
              className="text-gray-800 dark:text-gray-200"
            >
              {status.label}
            </label>
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
