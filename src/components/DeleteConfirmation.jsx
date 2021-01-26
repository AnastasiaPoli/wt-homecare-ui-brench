import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
  TextField
} from '@material-ui/core';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function DeleteConfirmation({ name, open, onClose, onApply }) {
  const [confirmationInput, setConfirmationInput] = useState('');
  const handleOnClose = () => {
    setConfirmationInput('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} keepMounted TransitionComponent={Transition}>
      <DialogTitle>Are you sure?</DialogTitle>
      <DialogContent>
        <DialogContentText>To confirm, please type "{name}" below:</DialogContentText>
        <TextField
          variant="outlined"
          margin="dense"
          fullWidth
          autoFocus
          name="confirmationInput"
          value={confirmationInput}
          onChange={(event) => setConfirmationInput(event.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="primary" onClick={handleOnClose}>
          Cancel
        </Button>
        <Button variant="outlined" color="primary" onClick={onApply} disabled={confirmationInput !== name}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
