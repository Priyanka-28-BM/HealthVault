import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

export default function DeleteConfirmationDialog({ 
  open, 
  itemName, 
  onClose, 
  onConfirm 
}) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirm Deletion</DialogTitle>
      <DialogContent>
        Are you sure you want to delete {itemName}?
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onConfirm} color="error">Delete</Button>
      </DialogActions>
    </Dialog>
  );
}