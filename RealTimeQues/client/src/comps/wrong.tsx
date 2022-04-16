import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function Wrong({state,dispatch,onClick}:{state:StudentReducer,dispatch:Function,onClick:Function}) {
  

  return (
    <div>
      <Dialog open={state.wrong} onClose={()=>dispatch({type:"wrong-close"})}>
        <DialogTitle>Wrong Session Code</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Your entered session code doesn't match any existing session.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>{
            onClick()
            dispatch({type:"wrong-close"})
          }}>OK</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
