import { Container, Box, Grid, Typography, Chip, TextField, Stack, List, ListItem, ListItemText, Collapse, IconButton, ListItemButton, Avatar, Button } from "@mui/material"
import { useReducer, useState, useEffect, useContext } from "react"
import "./Admin.css"
import axios from "axios"
import AddFab from "../../comps/AddFab"
import CloseFab from "../../comps/CloseFab"
import AddIcon from "@mui/icons-material/Add"
import Modal from "../../comps/Modal"
import { reducer } from "../../hooks/adminReducer"
import { Text } from "../../comps/Text"
import DeleteFab from "../../comps/DeleteFab"
import AdminContext from "../../hooks/Context"
import { io, Socket } from "socket.io-client"
import { useNavigate } from "react-router-dom"
import LoginContext from "../../hooks/loginContext"
export default function Admin() {
    const [sessions, setSession] = useState([] as number[])
    const [live, setLive] = useState([] as number[])
    const [state, dispatch] = useReducer(reducer, { id: 0, show: false, open: false })
    const [data, setData] = useState({} as Exam)
    const [listView, setListView] = useState([] as boolean[])
    const [socket, setSocket] = useState<Socket>() as [Socket, Function]
    const { login } = useContext(LoginContext) as Login
    const route = useNavigate()
    // after page loads check if user is logged in
    useEffect(() => {
        if (!login.length || !login.includes("admin")) route("/")
    }, [login])
    useEffect((): any => {
        const newSocket = io(import.meta.env.VITE_APP_SERVER as string, {
            query: { room: "admin" }
        })
        setSocket(newSocket)
        newSocket.on("created", (session: number[]) => setSession([...session]))
        newSocket.on("exam", (result: Exam) => setData(result))
        newSocket.on("live", (live: number[]) => setLive(live))
        return () => newSocket.close()
    }, [setSocket])

    useEffect(() => {
        if (Object.keys(data).includes(`${state.id}`)) {
            let arr = Array(data[`${state.id}`].length).fill(false)
            setListView(arr)
        }
    }, [state.id, data[state.id]])
    return <>
        <Container maxWidth="md">
            <Modal state={state} data={data} dispatch={dispatch} socket={socket} />
            <h1 className="mt-20 text-2xl font-bold">Dashboard</h1>
            <Grid container columnSpacing={2} rowSpacing={2} style={{ justifyContent: "center" }}>
                <Grid item>
                    <AddFab sessions={sessions} setSession={setSession} onClick={() => socket.emit("create")} />
                    <Box
                        sx={{
                            width: 300,
                            height: 300,
                            backgroundColor: 'InfoBackground',
                            borderRadius: 5,
                            overflow: 'auto'
                        }}
                        className="studentBox"
                    >
                        <Text fontSize="30px" text="Students" />
                        <Text fontSize="15px" text={"Connected: " + (live?.length || 0)} />
                        <Typography style={{ fontSize: "15px", display: "flex", textAlign: "left", marginLeft: "10px" }}>
                            All Sessions:
                            <Status color="#2E7D32" text="Live" />
                            <Status color="#E7E8B6" text="Offline" />
                        </Typography>
                        <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}>
                            {
                                sessions.map((session, index) => {
                                    return <Chip key={index} color={(live.includes(session)) ? "success" : "default"} style={{ margin: "2px 5px", }} label={session} onClick={(ev: any) => {
                                        let id = ev.target.textContent
                                        dispatch({ type: "show" })
                                        dispatch({ type: "id-" + id })
                                    }} />
                                })
                            }
                        </div>
                    </Box>
                </Grid>
                <Grid item style={{ display: (state.show) ? "flex" : "none" }}>
                    <Box
                        sx={{
                            width: 300,
                            height: 300,
                            backgroundColor: 'InfoBackground',
                            borderRadius: 5,
                            overflowY: 'auto',
                            overflowX: 'hidden'
                        }}
                        className="studentBox"
                    >
                        <CloseFab dispatch={dispatch} />
                        <AdminContext.Provider value={{ state, dispatch, socket }}>
                            <DeleteFab />
                        </AdminContext.Provider>
                        <Text fontSize="30px" text={"Session " + state.id} />
                        <div style={{ display: "flex", justifyContent: 'center' }}>
                            <TextField defaultValue="Questions" InputProps={{ readOnly: true, style: { marginLeft: "10px" } }} InputLabelProps={{ style: { fontWeight: "bolder", fontSize: "15px" } }} disabled fullWidth variant="standard" />
                            <IconButton children={<AddIcon />} onClick={() => dispatch({ type: "open" })} />
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-around" }}>
                            <Text fontSize="15px" text={"Total: " + (data[state.id]?.length || 0)} />
                        </div>
                        <List>
                            {
                                (data[`${state.id}`] || []).map((item: Question, index: number) => {
                                    return <div key={index}>
                                        <ListItemButton sx={{ width: "auto" }} style={{ backgroundColor: "#0A1929", color: "white" }} onClick={() => {
                                            listView[index] = !listView[index]
                                            setListView([...listView])
                                        }} >

                                            <ListItemText primary={item.question} secondary={
                                                <Typography color="white" variant="caption">
                                                    Answers: {item.count}
                                                </Typography>
                                            } />
                                        </ListItemButton>
                                        <Collapse in={listView[index]} timeout="auto" style={{
                                            marginTop: "-10px",
                                            borderRadius: 5
                                        }}>
                                            <ViewListItem text="Answers" value={item.answers.join(", ")} />
                                            <ViewListItem text="Correct" value={item.correct} />
                                        </Collapse>
                                    </div>
                                })
                            }
                        </List>
                    </Box>
                </Grid>

                <Grid item xs={12}>
                    <Stack alignItems="center" justifyContent="center" flexDirection="row">
                        <Button onClick={() => route("/results")} variant="contained" color="primary" style={{ marginRight: "2px" }}>Show Results</Button>
                        <Button onClick={() => {
                            let conf = confirm("Are you sure you want to delete all data?")
                            if (conf) {
                                let url = `${import.meta.env.VITE_APP_SERVER}/clear`
                                axios.get(url).then(() => alert("Data deleted"))
                            }
                        }} variant="contained" color="error" style={{ marginLeft: "2px" }}>Clear</Button>
                    </Stack>
                </Grid>
            </Grid>
        </Container>
    </>
}

function Status({ text, color }: { text: string, color: string }) {
    return <span style={{ display: "flex", alignItems: "center", lineHeight: 1, margin: "0 0px 0 10px" }}>
        {text} <span style={{ width: 10, height: 10, margin: "0 5px 0 2px", backgroundColor: color, borderRadius: "50%" }}></span>
    </span>
}

function ViewListItem({ text, value }: { text: string, value: string }) {
    return (<ListItem style={{
        backgroundColor: "ActiveBorder",
    }}>
        <ListItemText primary={text} secondary={value} />
    </ListItem>);
}
