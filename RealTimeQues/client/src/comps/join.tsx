import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useState } from 'react';

export default function Join({ state, dispatch, code, setCode }: { state: StudentReducer, dispatch: Function, code: number, setCode: Function }) {
  const [value, setValue] = useState("")

  return (
    <div>
      <Dialog open={state.join} onClose={() => dispatch({ type: "join-close" })}>
        <DialogTitle>Join Room</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the room code to join or ask your admin to share the code.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Session Code"
            type="number"
            fullWidth
            variant="standard"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => dispatch({ type: "join-close" })}>Cancel</Button>
          <Button onClick={() => {
            setCode(value)
            setValue("")
            dispatch({ type: "join-close" })
          }}>Subscribe</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
