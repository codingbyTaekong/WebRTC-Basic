import http from "http"
import express from "express";
import WebSocket from "ws";

const app = express();

console.log("hello")

app.set('view engine', 'pug');
app.set('views', __dirname + "/views");
app.use('/public', express.static(__dirname + "/public"))
app.get('/', (req,res)=> res.render('home'))
app.get('/*', (req,res)=> res.redirect('/'))


const handleListen = () => console.log(`Listening on http://localhost:3000`)
// app.listen(3000, handleListen);

//http 와 ws 서버를 모두 사용하기 위한 작업
const server = http.createServer(app);
const wss = new WebSocket.Server({server});

server.listen(3000, handleListen);
