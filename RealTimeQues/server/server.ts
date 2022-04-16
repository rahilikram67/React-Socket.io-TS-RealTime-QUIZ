import { SocketClass } from "./modules/SocketClass";
import mongoose from "mongoose";
import { json2csvAsync } from "json-2-csv"
const { http, app } = SocketClass.getInstance();
let multer = require('multer');
let upload = multer({ dest: 'uploads/' });
require("dotenv").config()
import { rmSync, renameSync, mkdirSync } from "fs"
mongoose.connect(process.env.MONGODB_URI as string, () => console.log("connected"));
const cors = require('cors');
// cors request from client
app.use("*", cors({
    origin: process.env.FROM_ORIGIN,
}))
app.get("/", (req, res) => {
    console.log("locals")
    res.end()
})
app.post("/post", upload.array("file"), (req: any, res) => {
    let url = req.protocol + '://' + req.get('host');
    let paths = [];
    for (let v of req.files) {
        paths.push(url + "/image/" + v.filename);
        renameSync(v.path, v.path + ".jpg");
    }
    res.json({ paths })
})

app.get("/image/:id", (req, res) => {
    res.sendFile(__dirname + "/uploads/" + req.params.id + ".jpg")
})

app.get("/dbdata", async (req, res) => {
    let data = await mongoose.connection.db.collection("exam").find({}).toArray()
    res.json(data)
})

app.post("/csv", async (req, res) => {
    var data = await json2csvAsync(req.body, {
        keys: [{ field: 'user', title: 'Username' }, { field: 'question', title: 'Question' }, { field: 'answers', title: 'Answers' }, { field: "choosen", title: "Choosen" }, { field: 'correct', title: 'Correct' }, { field: 'time', title: 'TimeStamp   ' }, { field: 'session', title: 'Session' }, { field: "Status", title: "Status" }]
    });
    res.attachment('data.csv');
    res.status(200).send(data);
})

app.get("/clear", (req, res) => {
    mongoose.connection.db.collection("exam").drop()
    rmSync(__dirname + "/uploads/", { recursive: true, force: true })
    mkdirSync(__dirname + "/uploads/", { recursive: true })
    res.end()
})

http.listen(process.env.PORT || 3002, () => {
    console.log("listening on *:3002");
});