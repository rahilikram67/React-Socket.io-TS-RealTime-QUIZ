import { Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add"


export default function AddFab({ sessions, setSession, onClick }: { sessions: number[], setSession: Function, onClick: Function }) {

    return (<Fab style={{
        backgroundColor: '#3f51b5',
        position: 'absolute',
        margin: "10px 0 0 235px"
    }} color="primary" onClick={() => {
        onClick()
    }}>
        <AddIcon />
    </Fab>);
}
function random4Digit(session: number[], setSession: Function) {
    for (let i = 0; i < 10000; i++) {
        let num = Math.floor(Math.random() * 10000)
        if (session.indexOf(num) === -1 && String(num).length >= 4) {
            setSession((session.concat([num])))
            return
        }
    }
}