import { Fab } from "@mui/material";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useState } from "react";
import RemoveNotif from "./permanentRemove";

export default function DeleteFab() {
    const [open, setOpen] = useState(false)
    return (<Fab style={{
        position: 'absolute',
        margin: "6px 0 0 10px",
        width: "35px",
        height: "20px",
        boxShadow: "none",
        border: "none",
        mixBlendMode: "hard-light"
    }} onClick={() => {
        setOpen(!open)
    }}>
        <DeleteForeverIcon />
        <RemoveNotif open={open} setOpen={setOpen}  />
    </Fab>);
}

