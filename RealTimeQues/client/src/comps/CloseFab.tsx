import { Fab } from "@mui/material";
import CrossIcon from "@mui/icons-material/Close";

export default function CloseFab({ dispatch }:{dispatch:Function}) {
  return (<Fab style={{
    position: 'absolute',
    margin: "6px 0 0 260px",
    width: "35px",
    height: "20px",
    boxShadow: "none",
    border: "none",
    mixBlendMode: "hard-light"
  }} onClick={() => {
    dispatch({
      type: "hide"
    });
  }}>
    <CrossIcon />
  </Fab>);
}

