import { Container, TextField, Stack, Typography, Select, MenuItem, Button, TableContainer, Table, TableHead, TableBody, TableRow, TableCell } from "@mui/material"
import { Box } from "@mui/system"
import { useEffect, useState } from "react"
import axios from "axios"
export default function Results() {
    const [sort, setSort] = useState("time")
    const [ascdesc, setAscDesc] = useState("desc")
    const [data, setData] = useState([] as any)
    const [filter, setFilter] = useState([] as any)
    const [session, setSession] = useState("")
    const [user, setUser] = useState("")
    const [ques, setQues] = useState("")
    const headers = ["Username", "Question", "Answers", "Correct", "Choosen", "Images", "Session", "Time"]
    useEffect(() => {
        let url = import.meta.env.VITE_APP_SERVER as string
        axios.get(`${url}/dbdata`).then(res => {
            setData(res.data)
            setFilter(sortFunc(ascdesc, sort, res.data))
        })
    }, [])
    useEffect(() => {
        setFilter(inputFunc(session, user, ques, data))
    }, [session, user, ques])
    return <Container maxWidth="lg">
        <Box style={{ border: "1px solid Action", marginTop: "10px", display: "flex", justifyContent: "center" }}>
            <TextField onChange={(ev) => setSession(ev.target.value)} value={session} size="small" type="number" placeholder="Session Code" />
            <TextField onChange={(ev) => setUser(ev.target.value)} value={user} style={{ marginLeft: "5px", marginRight: "5px" }} size="small" placeholder="Username" />
            <TextField onChange={(ev) => setQues(ev.target.value)} value={ques} size="small" placeholder="Question" />
        </Box>
        <Stack style={{ marginTop: "10px" }} flexDirection="row" justifyContent="center" alignItems="center">
            <Typography variant="h6">Sort By</Typography>
            <Select
                size="small"
                value={sort}
                style={{ marginLeft: "5px", marginRight: "5px" }}
                onChange={(ev) => {
                    setSort(ev.target.value)
                    setFilter(sortFunc(ascdesc, ev.target.value, filter))
                }}
            >
                <MenuItem value="session">Session</MenuItem>
                <MenuItem value="time">Datetime</MenuItem>
            </Select>
            <Select
                size="small"
                value={ascdesc}
                style={{ marginRight: "5px" }}
                onChange={(ev) => {
                    setAscDesc(ev.target.value)
                    setFilter(sortFunc(ev.target.value, sort, filter))
                }}
            >
                <MenuItem value="asc">Ascending</MenuItem>
                <MenuItem value="desc">Descending</MenuItem>
            </Select>
        </Stack>
        <form>

        </form>
        <Button onClick={() => printCsv(JSON.parse(JSON.stringify(filter)))} variant="contained" style={{ display: "block", margin: "auto", marginTop: "10px" }} color="success">Print CSV</Button>
        {/* table data */}
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        {
                            headers.map(header => <TableCell sx={{ textAlign: "center" }} key={header}>{header}</TableCell>)
                        }
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        filter.map((row: any, index: number) => <TableRow key={index}>
                            <TableCell sx={{ textAlign: "center" }}>{row.user}</TableCell>
                            <TableCell sx={{ textAlign: "center" }}>{row.question}</TableCell>
                            <TableCell sx={{ textAlign: "center" }}>
                                <Select value="answers">
                                    <MenuItem value="answers">Answers</MenuItem>
                                    {
                                        row.answers.map((ans: any, index: number) => <MenuItem key={index} value={ans}>{ans}</MenuItem>)
                                    }
                                </Select>
                            </TableCell>
                            <TableCell sx={{ textAlign: "center" }}>{row.correct}</TableCell>
                            <TableCell sx={{ textAlign: "center" }}>{row.choosen}</TableCell>
                            <TableCell sx={{ textAlign: "center" }}>
                                <Select onChange={(ev) => window.open(ev.target.value, "_blank")} value="images">
                                    <MenuItem value="images">Images</MenuItem>
                                    {
                                        (row.imgs) ? row.imgs.map((img: any, index: number) => <MenuItem key={index} value={img}>{img}</MenuItem>) : <MenuItem value="images">No Images</MenuItem>
                                    }
                                </Select>
                            </TableCell>
                            <TableCell sx={{ textAlign: "center" }}>{row.session}</TableCell>
                            <TableCell sx={{ textAlign: "center" }}>{new Date(row.time).toISOString().replace("T", " ").split(".")[0]}</TableCell>
                        </TableRow>)

                    }
                </TableBody>
            </Table>
        </TableContainer>
    </Container>
}

function sortFunc(ascdesc: string, sort: string, data: []) {
    if (ascdesc === "asc") return data.sort((a: any, b: any) => Number(a[sort]) - Number(b[sort]))
    else if (ascdesc === "desc") return data.sort((a: any, b: any) => Number(b[sort]) - Number(a[sort]))
}

function inputFunc(session: string, user: string, ques: string, data: any[]) {
    if (!session && !user && !ques) return data
    return data.filter((row: any) => {
        return (session ? row.session.includes(session) : true) &&
            (user ? row.user.toLowerCase().includes(user.toLowerCase()) : true) &&
            (ques ? row.question.toLowerCase().includes(ques.toLowerCase()) : true)
    })
}
async function printCsv(filter: any[]) {
    let url = import.meta.env.VITE_APP_SERVER as string
    filter.map(e => {
        delete e._id
        delete e.count
        e.time = new Date(e.time).toISOString().replace("T", " ").split(".")[0]
        e.answers = e.answers.join(", ")
        e.imgs = (e.imgs || []).join(", ")
        e.Status = e.correct === e.choosen ? "Correct" : "Incorrect"
        return e
    })


    let res = await axios({
        method: "post",
        url: `${url}/csv`,
        data: filter,
        responseType: "blob"
    })
    let blob = new Blob([res.data], { type: "text/csv" })
    let url2 = window.URL.createObjectURL(blob)
    let link = document.createElement("a")
    link.href = url2
    link.setAttribute("download", "result.csv")
    document.body.appendChild(link)
    link.click()
}