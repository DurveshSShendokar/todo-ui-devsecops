import React, { useState } from 'react';
import {
  Button,
  Typography,
  Box,
  Grid,
  TextField,
  MenuItem,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import HolidayTable from './Table';
import HolidayForm from './form';
import CustomModal from '../../common/customModal';
import {
  useAddHoliday,
  useUpdateHoliday,
  useDeleteHoliday,
} from './hooks';

const HolidayMaster = (darkMode) => {
  const [currentHoliday, setCurrentHoliday] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [editId, setEditId] = useState();
  const [holidayId, setHolidayId] = useState();
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const addHoliday = useAddHoliday();
  const updateHoliday = useUpdateHoliday(editId);
  const deleteHoliday = useDeleteHoliday(holidayId);

  const handleOpenAdd = () => {
    setCurrentHoliday(null);
    setIsModalOpen(true);
  };

  const handleEditHoliday = (holiday) => {
    setEditId(holiday.id);
    setCurrentHoliday(holiday);
    setIsModalOpen(true);
  };

  const handleDeleteHoliday = (id) => {
    setHolidayId(id);
    deleteHoliday.mutate({
      onSuccess: () => {
        // refetch logic here
      },
    });
  };

  const handleCloseModal = () => {
    setCurrentHoliday(null);
    setIsModalOpen(false);
  };

  const handleSubmit = (formData) => {
    if (currentHoliday) {
      updateHoliday.mutate(formData, {
        onSuccess: () => {
          handleCloseModal();
        },
      });
    } else {
      addHoliday.mutate(formData, {
        onSuccess: () => {
          handleCloseModal();
        },
      });
    }
  };

  const handleExport = () => {
    console.log('Exporting holidays...');
  };

  const handleResetFilters = () => {
    setSearchKeyword('');
    setYear('');
    setMonth('');
  };

  const monthOptions = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: new Date(0, i).toLocaleString('default', { month: 'long' }),
  }));

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: currentYear - 1900 + 11 }, (_, i) => currentYear + 10 - i);

  return (
    <Box p={2}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
        Holiday
      </Typography>

      <Grid
        container
        spacing={2}
        direction={isMobile ? 'column' : 'row'}
        alignItems={isMobile ? 'stretch' : 'center'}
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        {/* Left Section */}
        <Grid item xs={12} md={9}>
          <Grid
            container
            spacing={2}
            direction={isMobile ? 'column' : 'row'}
            alignItems={isMobile ? 'stretch' : 'center'}
          >
            <Grid item xs={12} sm="auto">
              <Button fullWidth={isMobile} variant="contained" onClick={handleOpenAdd}>
                Add Holiday
              </Button>
            </Grid>
            <Grid item xs={12} sm="auto">
              <TextField
                label="Search"
                variant="outlined"
                size="small"
                fullWidth={isMobile}
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm="auto">
              <TextField
                label="Year"
                select
                size="small"
                fullWidth={isMobile}
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value))}
              >
                {yearOptions.map((y) => (
                  <MenuItem key={y} value={y}>
                    {y}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm="auto">
              <TextField
                label="Month"
                select
                size="small"
                fullWidth={isMobile}
                value={month}
                onChange={(e) => setMonth(parseInt(e.target.value))}
              >
                {monthOptions.map((m) => (
                  <MenuItem key={m.value} value={m.value}>
                    {m.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm="auto">
              <Button fullWidth={isMobile} variant="outlined"     color="secondary" onClick={handleResetFilters}>
                Reset Filters
              </Button>
            </Grid>
          </Grid>
        </Grid>

        {/* Right Section: Export Button */}
        <Grid item xs={12} md="auto">
          <Button
            fullWidth={isMobile}
            variant="contained"
        
                color="success"
            onClick={handleExport}
          >
            Export
          </Button>
        </Grid>
      </Grid>

      {/* Holiday Table */}
      <HolidayTable
        onEdit={handleEditHoliday}
        onDelete={handleDeleteHoliday}
        searchKeyword={searchKeyword}
        year={year}
        month={month}
      />

      {/* Modal */}
      <CustomModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        dialogTitle={currentHoliday ? 'Edit Holiday' : 'Add Holiday'}
        dialogDescription="Fill in the holiday details below"
        formId="holiday-form"
        showSaveButton
        showCloseButton
        isLoading={addHoliday.isPending || updateHoliday.isPending}
        width="600px"
        height="400px"
      >
        <HolidayForm
          initialData={currentHoliday}
          onSubmit={handleSubmit}
          formId="holiday-form"
        />
      </CustomModal>
    </Box>
  );
};

export default HolidayMaster;
