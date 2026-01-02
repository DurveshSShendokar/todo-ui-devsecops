import React, { useState, useEffect } from 'react';
import { TextField, Stack } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const HolidayForm = ({ initialData, onSubmit, formId = 'holiday-form' }) => {
  const [formData, setFormData] = useState({
    date: null,
    holidayName: '',
    remark: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        date: initialData.date ? new Date(initialData.date) : null,
        holidayName: initialData.holidayName || '',
        remark: initialData.remark || ''
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({ ...prev, date }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      date: formData.date ? formData.date.toISOString().split('T')[0] : null
    };
    onSubmit(payload);
  };

  return (
    <form id={formId} onSubmit={handleSubmit}>
      <Stack spacing={3}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Holiday Date"
            value={formData.date}
            onChange={handleDateChange}
            renderInput={(params) => <TextField fullWidth {...params} />}
          />
        </LocalizationProvider>

        <TextField
          fullWidth
          label="Holiday Name"
          name="holidayName"
          value={formData.holidayName}
          onChange={handleChange}
        />

        <TextField
          fullWidth
          label="Remark"
          name="remark"
          value={formData.remark}
          onChange={handleChange}
        />
      </Stack>
    </form>
  );
};

export default HolidayForm;
