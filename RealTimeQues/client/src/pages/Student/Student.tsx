import { Button, Container, Grid, Box, Stack, CircularProgress, ListItem, ListItemText, List, ListItemIcon, Typography } from "@mui/material"
import { useEffect, useReducer, useState, useContext } from "react"
import Join from "../../comps/join"
import Wrong from "../../comps/wrong"
import Connected from "../../comps/connected"
import { reducer } from "../../hooks/studentReducer"
import QuestionAsker from "../../comps/QuestionAsker"
import { io, Socket } from "socket.io-client"
import { Text } from "../../comps/Text"
import LoginContext from "../../hooks/loginContext"
import { useNavigate } from "react-router-dom"
export default function Student() {
    const [state, dispatch] = useReducer(reducer, { join: false, wrong: false, connected: false })
    const [code, setCode] = useState(0)
    const [session, setSession] = useState(0)
    const [choosen, setChoosen] = useState("")
    const [end, setEnd] = useState(false)
    const [data, setData] = useState([]) as [Question[], Function]
    const [index, setIndex] = useState(-1)
    const [socket, setSocket] = useState<Socket>() as [Socket, Function]
    const { login } = useContext(LoginContext) as Login
    const route = useNavigate()
    // after page loads check if user is logged in
    useEffect(() => {
        if (!login.length) route("/")
    }, [login])
    useEffect(() => {
        if (!code) return
        const newSocket = io(import.meta.env.VITE_APP_SERVER as string, {
            query: { room: code }
        })
        newSocket.on("invalid", () => dispatch({ type: "wrong-open" }))
        newSocket.on("data", (ques: Question[]) => setData(ques))
        newSocket.on("ended", () => setEnd(true))
        newSocket.on("setIndex", (indexN: number) => setIndex(indexN))
        newSocket.on("joined", () => {
            dispatch({ type: "connected-open" })
            setSession(code)
            setSocket(newSocket)
        })
    }, [code])
    return <Container maxWidth="md">
        <Grid container columnSpacing={2} rowSpacing={2} style={{ marginTop: 100, justifyContent: "center" }}>
            <Grid item>
                <Box
                    sx={{
                        width: 300,
                        height: 300,
                        backgroundColor: 'InfoBackground',
                        borderRadius: 5,
                        overflow: 'auto',
                    }}
                    className="studentBox"
                >
                    <Button variant="outlined" style={{ display: (session === 0) ? "block" : "none", width: 150, margin: "auto", transform: "translateY(340%)" }} onClick={() => dispatch({ type: "join-open" })}>
                        JOIN ROOM
                    </Button>

                    <Join state={state} dispatch={dispatch} code={code} setCode={setCode} />
                    <Wrong state={state} dispatch={dispatch} onClick={() => setSession(0)} />
                    <Connected dispatch={dispatch} state={state} />

                    <div hidden={!session} style={{ margin: "10px", textAlign: "left" }}>
                        {(data && data[index] && data.length !== index) ?
                            <>
                                <QuestionAsker {...data[index]} hookChoosen={choosen} setChoosen={setChoosen} />
                                <Button style={{ display: "block", margin: "auto" }} onClick={() => {
                                    if (!choosen) return
                                    Object.assign(data[index], { choosen, session, user: login })
                                    setIndex(index + 1)
                                    setChoosen("")
                                    socket.emit("answers", { room: session, data: data.slice(-1)[0] })
                                }}>
                                    Submit
                                </Button>
                            </> : null
                        }
                        {
                            <Stack style={{ display: (index === (data?.length || -1) && !end) ? "flex" : "none", textAlign: "center" }} spacing={2} direction="column">
                                <h4>Waiting for admin response</h4>
                                <CircularProgress color="primary" style={{ margin: "0 auto" }} />
                            </Stack>
                        }
                        {
                            <div style={{ display: (end) ? "block" : "none", textAlign: "center" }}>
                                <h2>Results will be shared with you soon</h2>
                                <Typography style={{ textAlign: "center" }} variant="h5" >
                                    Good Luck!
                                </Typography>
                                {/* <div style={{ display: "flex", justifyContent: "space-around" }}>
                                    <Text fontSize="15px" text={"Total: " + (data?.length || 0)} />
                                    <Text fontSize="15px" text={"Correct: " + ((data?.length) ? data.filter(el => el.choosen && el.choosen === el.correct).length : 0)} />
                                    <Text fontSize="15px" text={"Wrong: " + ((data?.length) ? data.filter(el => el.choosen && el.choosen !== el.correct).length : 0)} />
                                </div>
                                <List>
                                    {
                                        (data) ? data.map((question, index) => <ListItem key={index} style={{ display: "flex", flexDirection: "column" }}>
                                            <ListItemText primaryTypographyProps={{ style: { fontSize: "20px" } }} primary={(index + 1) + ". " + question.question} />
                                            <ListItemText primary={"Correct"} secondary={question.correct} />
                                            <ListItemText primary={"Chosen"} secondary={question.choosen} />
                                        </ListItem>) : null

                                    }
                                </List> */}
                            </div>
                        }
                    </div>

                </Box>
            </Grid>
        </Grid>
    </Container>
}