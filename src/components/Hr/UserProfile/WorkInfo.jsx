import React from "react";
import {
  Typography,
  Card,
  CardContent,
  CardHeader,
  Box,
  Divider,
  Stack,
} from "@mui/material";
import WorkIcon from "@mui/icons-material/Work";
import BusinessIcon from "@mui/icons-material/Business";

const WorkInfo = ({darkMode}) => {
  return (
    <Card
      elevation={3}
      sx={{
        bgcolor: "background.paper",
        mt: 4,
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <CardHeader
        title="Work Information"
        sx={{
          bgcolor: "primary.main",
          color: darkMode ? "#000":"white",
          py: 2,
          px: 3,
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
        }}
      />
      <CardContent>
        <Stack spacing={2}>
          <Box display="flex" alignItems="center">
            <WorkIcon color="action" sx={{ mr: 2 }} />
            <Box>
              <Typography variant="subtitle2" color="textSecondary">
                Occupation
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                Software Engineer
              </Typography>
            </Box>
          </Box>

          <Divider />

          <Box display="flex" alignItems="center">
            <BusinessIcon color="action" sx={{ mr: 2 }} />
            <Box>
              <Typography variant="subtitle2" color="textSecondary">
                Company
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                Zionit Software Pvt. Ltd.
              </Typography>
            </Box>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default WorkInfo;
