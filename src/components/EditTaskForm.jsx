import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';

const EditTaskForm = ({
  open,
  onClose,
  onSave,
  initialData = {
    title: '',
    description: '',
    problemStatement: '',
    referenceCode: '',
  },
}) => {
  const [title, setTitle] = useState(initialData.title);
  const [description, setDescription] = useState(initialData.description);
  const [problemStatement, setProblemStatement] = useState(initialData.problemStatement || '');
  const [referenceCode, setReferenceCode] = useState(initialData.referenceCode || '');

  useEffect(() => {
    setTitle(initialData.title);
    setDescription(initialData.description);
    setProblemStatement(initialData.problemStatement || '');
    setReferenceCode(initialData.referenceCode || '');
  }, [initialData]);

  const handleSubmit = () => {
    onSave({
      title,
      description,
      problemStatement,
      referenceCode,
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Task</DialogTitle>
      <DialogContent>
        <TextField
          margin="normal"
          label="Title"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          margin="normal"
          label="Description"
          fullWidth
          multiline
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <TextField
          margin="normal"
          label="Problem Statement"
          fullWidth
          multiline
          rows={3}
          value={problemStatement}
          onChange={(e) => setProblemStatement(e.target.value)}
        />
        <TextField
          margin="normal"
          label="Reference Code"
          fullWidth
          multiline
          rows={3}
          value={referenceCode}
          onChange={(e) => setReferenceCode(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditTaskForm;
