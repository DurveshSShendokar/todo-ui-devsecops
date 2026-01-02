import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";

function formatDate(dateString) {
  if (!dateString) return "No Completion Date";

  const date = new Date(dateString);
  if (isNaN(date)) return "No Completion Date"; 

  const options = { day: "numeric", month: "short", year: "numeric" };
  return date.toLocaleDateString("en-GB", options);
}


export default function BasicModal({ handleClose, open, items }) {
  // ✅ Safeguard against null task
  if (!open || !items) return null;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-md">
        <Box className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-8 max-w-3xl w-full overflow-y-auto">
          <Box className="border-b border-gray-300 dark:border-gray-600 pb-4 mb-6">
            <Typography
              id="modal-modal-title"
              variant="h5"
              component="h2"
              className="text-center text-2xl font-bold text-blue-500"
            >
              Task: {items.taskName}
            </Typography>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" className="font-semibold text-blue-500">
                Description:
              </Typography>
              <Typography variant="body1" className="mt-1 text-gray-900 dark:text-gray-100">
                {items.taskDescription}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" className="font-semibold text-blue-500">
                Added Date:
              </Typography>
              <Typography variant="body1" className="mt-1 text-gray-900 dark:text-gray-100">
                {formatDate(items.addedDateTime)}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" className="font-semibold text-blue-500">
                Status:
              </Typography>
              <Typography variant="body1" className="mt-1 text-gray-900 dark:text-gray-100">
                {items.status}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" className="font-semibold text-blue-500">
                Completed Date:
              </Typography>
              <Typography variant="body1" className="mt-1 text-gray-900 dark:text-gray-100">
                {formatDate(items.completedDateTime)}
              </Typography>
            </Grid>
          </Grid>

          <Box className="border-t border-gray-300 dark:border-gray-600 pt-4 mt-6 text-center">
            <Button
              onClick={handleClose}
              variant="contained"
              color="primary"
              className="mt-4"
            >
              Close
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}