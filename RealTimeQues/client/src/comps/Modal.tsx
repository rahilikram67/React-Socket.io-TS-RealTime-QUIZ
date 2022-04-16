
import { Box, Button, Chip, Modal, TextField, Stack, LinearProgress } from "@mui/material"
import { useRef, useState } from "react";
import { Socket } from "socket.io-client";
import axios from "axios";
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "50%",
    maxWidth: "500px",
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 2,
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
};

export default function ({ state, dispatch, data, socket }: { dispatch: Function, state: AdminReducer, data: Exam, socket: Socket }) {
    const [chips, setChips] = useState([] as string[])
    const [question, setQuestion] = useState("")
    const [questionHelper, setQuestionHelper] = useState("")
    const [chipHelper, setChipHelper] = useState("")
    const [files, setFiles] = useState([])
    const inputref = useRef<HTMLInputElement>(null)
    const [progress, setProgress] = useState(-1)
    const handleFiles = (ev: any) => setFiles(ev.target.files)
    const resetImages = (ev: any) => {
        setFiles([])
        if (inputref.current) inputref.current.value = ""
    }
    return (
        <div>
            <Modal
                keepMounted
                open={state.open}
                onClose={() => dispatch({ type: "close" })}
            >
                <Box sx={style}>
                    <TextField
                        label="Question"
                        multiline
                        variant="standard"
                        value={question}
                        fullWidth
                        onChange={(ev: any) => setQuestion(ev.target.value)}
                        style={{ margin: "0 5px" }}
                        helperText={questionHelper}
                        FormHelperTextProps={{ style: { color: "red" } }}
                    />
                    <TextField
                        id="answers"
                        variant="standard"
                        fullWidth
                        style={{ margin: "5px 5px 0 5px" }}
                        placeholder="Write Answer and press Enter"
                        onKeyDown={(ev: any) => {
                            if (ev.key !== "Enter" || ev.target.value === "" || ev.target.value === "~") return
                            chips.push(ev.target.value)
                            setChips(Array.from(new Set(chips)))
                            ev.target.value = ""
                        }}
                        helperText={chipHelper}
                        FormHelperTextProps={{ style: { color: "red" } }}
                    />
                    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "flex-start" }}>
                        {
                            chips.map((chip, index) => {
                                return <Chip key={index} label={chip} style={{ margin: "5px 5px" }} color={(chip.split("~")[1] || "default") as any} onClick={chipClickHandle(chips, index, chip, setChips)} />
                            })
                        }
                    </div>
                    <Stack flexDirection="row" justifyContent="space-between" alignItems="center" style={{ marginTop: "20px" }}>
                        <input ref={inputref} onChange={handleFiles} type="file" multiple accept="image/*" maxLength={3} />
                        <Button onClick={resetImages}>Reset</Button>
                    </Stack>
                    <LinearProgress variant="determinate" style={{ display: progress < 0 ? "none" : "block" }} color="success" value={progress} />
                    <Button style={{ width: "auto" }} onClick={async () => {
                        
                        if (!question) return setQuestionHelper("Type a question")
                        else setQuestionHelper("")
                        if (!chips.find(e => e.includes("~"))) return setChipHelper("Please select an answer")
                        else setChipHelper("")
                        let links: string[] = await uploadFiles(files, setProgress)
                        let obj: Question =  {
                            user: "",
                            question,
                            correct: chips.filter(chip => chip.split("~")[1] === "primary")[0].split("~")[0],
                            answers: chips.map(el => el.split("~")[0]),
                            choosen: "",
                            session:state.id,
                            imgs: links,
                            count:0
                        }
                        data[state.id] = (data[state.id] || []).concat(obj)
                        socket.emit("exam", { data, room: state.id })
                        cleanAll(setQuestion, setChips, setProgress, inputref, dispatch);
                    }}>
                        Add
                    </Button>
                </Box>
            </Modal>
        </div>
    );
}

function cleanAll(setQuestion: Function, setChips: Function, setProgress: Function, inputref: any, dispatch: Function) {
    setQuestion("");
    setChips([]);
    setProgress(-1);
    if (inputref.current) inputref.current.value = "";
    (document.getElementById("answers") as HTMLInputElement).value = "";
    dispatch({ type: "close" });
}

function chipClickHandle(chips: string[], index: number, chip: string, setChips: Function) {
    return () => {
        if (chip.includes("~")) return
        let arr = chips.map(el => el.split("~").shift());
        arr[index] = chip + "~primary";
        setChips(arr);
    };
}

async function uploadFiles(files: any[], setProgress: Function) {

    if (files.length == 0) return
    let formData = new FormData();
    for (let file of files) {
        formData.append("file", file);
    }
    let url = import.meta.env.VITE_APP_SERVER as string
    var res = await axios.post(`${url}/post`, formData, {
        onUploadProgress: (progressEvent: any) => {            
            setProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total))
        }
    });
    setProgress(100);
    return res.data.paths
}