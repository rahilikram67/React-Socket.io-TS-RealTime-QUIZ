import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function Connected({state,dispatch}:{state:StudentReducer,dispatch:Function}) {
  

  return (
    <div>
      <Dialog open={state.connected} onClose={()=>dispatch({type:"connected-close"})}>
        <DialogTitle>Connected</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You connected for live quiz session. You may have to wait for admin response. Please wait 
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>dispatch({type:"connected-close"})}>OK</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
