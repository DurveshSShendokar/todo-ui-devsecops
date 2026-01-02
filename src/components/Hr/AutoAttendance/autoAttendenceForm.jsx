import React, { useState, useEffect } from "react";
import {
  TextField,
  Switch,
  FormControlLabel,
  Box,
} from "@mui/material";

const AutoAttendanceForm = ({ formId, initialData = {}, onSubmit }) => {
  const [userId, setUserId] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [signInTime, setSignInTime] = useState("");
  const [outTime, setOutTime] = useState(""); // 🆕 Out-Time state
  const [userName, setUserName] = useState("");

  useEffect(() => {
    if (initialData) {
      const id = initialData?.user?.id;
      setUserId(id);
      setIsActive(initialData?.isActive);

      const signIn = initialData?.signInTime;
      const out = initialData?.outTime; // 🆕
      setSignInTime(signIn || "");
      setOutTime(out || ""); // 🆕

      const name =
        initialData?.user?.firstName && initialData?.user?.lastName
          ? `${initialData.user.firstName} ${initialData.user.lastName}`
          : initialData?.userName || "";
      setUserName(name);
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userId || !signInTime || !outTime) return;

    const payload = {
      userId: Number(userId),
      isActive: isActive ? 1 : 0,
      signInTime: signInTime,
      outTime: outTime, // 🆕 Include Out-Time
    };

    onSubmit(payload);
  };

  return (
    <form id={formId} onSubmit={handleSubmit}>
      <Box display="flex" flexDirection="column" gap={2}>
        <div className="grid grid-cols-2 gap-4">
          <TextField
            label="User"
            value={userName}
            fullWidth
            disabled
          />

          <TextField
            type="time"
            label="Sign-In Time"
            value={signInTime}
            onChange={(e) => setSignInTime(e.target.value)}
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            type="time"
            label="Out-Time"
            value={outTime}
            onChange={(e) => setOutTime(e.target.value)}
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
          />

          <FormControlLabel
            control={
              <Switch
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
              />
            }
            label="Is Active"
          />
        </div>
      </Box>
    </form>
  );
};

export default AutoAttendanceForm;
