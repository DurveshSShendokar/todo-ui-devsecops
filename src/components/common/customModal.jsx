import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography
} from "@mui/material";

const CustomModal = ({
  isOpen,
  onClose,
  dialogTitle = "Dialog Title",
  dialogDescription = "Dialog Description",
  children,
  formId,
  isLoading = false,
  width = "max-w-3xl",
  height = "400px",
  showCloseButton = true,
  showSaveButton = true,
}) => {
  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h6">{dialogTitle}</Typography>
        {dialogDescription && (
          <Typography variant="body2" color="textSecondary">
            {dialogDescription}
          </Typography>
        )}
      </DialogTitle>

      <DialogContent
        dividers
        // sx={{
        //   maxHeight: height,
        //   width: width,
        //   overflowY: "auto",
        // }} cla
      >
        <Box>{children}</Box>
      </DialogContent>

      <DialogActions sx={{ justifyContent: { xs: "start", sm: "end" } }}>
        {showCloseButton && (
          <Button onClick={onClose} variant="outlined" color="secondary">
            Close
          </Button>
        )}
        {showSaveButton && formId && (
          <Button
            type="submit"
            form={formId}
            variant="contained"
            color="primary"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default CustomModal;
