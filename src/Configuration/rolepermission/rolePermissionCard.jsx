import React, { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Checkbox,
  FormControlLabel,
  Grid,
  Box,
  Paper,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const RolePermissionCard = ({
  permissionsName,
  actions,
  selected,
  onPermissionChange,
  onActionChange,
  darkMode,
}) => {
  const [expanded, setExpanded] = useState(false);

  const handleAccordionChange = (_event, isExpanded) => {
    setExpanded(isExpanded);
  };

  const handlePermissionCheckboxClick = (e) => {
    // e.stopPropagation();     
    // e.preventDefault();     
  };

  const handlePermissionCheckboxChange = (e) => {
    onPermissionChange(e.target.checked); // Only call your API here
  };

  return (
    <Paper elevation={3}>
      <Accordion expanded={expanded} onChange={handleAccordionChange}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ backgroundColor: darkMode ? "#000":"#fff", color: darkMode ? "#fff": "#000" ,  borderRadius: "6px" }}> 
          <Box display="flex" alignItems="center" width="100%">
            <FormControlLabel
              onClick={handlePermissionCheckboxClick}
              control={
                <Checkbox
                  checked={selected}
                  onChange={handlePermissionCheckboxChange}
                />
              }
              label={<Typography variant="subtitle1">{permissionsName}</Typography>}
            />
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={1}>
            {actions.map((action, index) => (
              <Grid item xs={6} key={index}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={action.selected}
                      onChange={(e) =>
                        onActionChange(index, e.target.checked)
                      }
                    />
                  }
                  label={action.actionName}
                />
              </Grid>
            ))}
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Paper>
  );
};

export default RolePermissionCard;
