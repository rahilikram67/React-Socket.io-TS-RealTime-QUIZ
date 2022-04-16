import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useContext } from 'react';
import { Socket } from 'socket.io-client';
import AdminContext from "../hooks/Context"
export default function RemoveNotif({ open, setOpen }: { open: boolean, setOpen: Function }) {
    const context = useContext(AdminContext) as DeleteFabButton & { socket: Socket };
    const { dispatch, state, socket } = context
    return (
        <div>
            <Dialog open={open} onClose={() => setOpen(!open)}>
                <DialogTitle>Alert</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Do you want to remove this Session completely. User Data will be completely removed
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setOpen(!open)
                    }}>NO</Button>
                    <Button onClick={() => {
                        dispatch({ type: "hide" })
                        socket.emit("deleteSession", state.id)
                        setOpen(!open)
                    }}>YES</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
