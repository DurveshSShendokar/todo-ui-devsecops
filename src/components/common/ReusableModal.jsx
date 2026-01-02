import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box
} from "@mui/material";

const ReusableModal = ({
  open,
  onClose,
  onSubmit,
  title = "Form",
  children,
  submitLabel = "Submit",
  cancelLabel = "Cancel",
  maxWidth = "md",
  fullWidth = true,
  customStyles = {}
}) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth={fullWidth} maxWidth={maxWidth}>
      <DialogTitle sx={{ fontWeight: "bold" }}>{title}</DialogTitle>

      <DialogContent sx={{ ...customStyles }}>
        <Box component="form" noValidate autoComplete="off">
          {children}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="outlined" color="secondary">
          {cancelLabel}
        </Button>
        <Button onClick={onSubmit} variant="contained" color="primary">
          {submitLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReusableModal;
