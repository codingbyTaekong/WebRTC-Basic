import http from "http"
import express from "express";
// 기본방식
// import  {Socket}  from "socket.io";
// admin ui를 사용할 때
import  Socket  from "socket.io";

let port = 3001;

const app = express();
app.set('view engine', 'pug');
app.set('views', __dirname + "/views");
app.use('/public', express.static(__dirname + "/public"))
app.get('/', (req,res)=> res.render('home'))
app.get('/*', (req,res)=> res.redirect('/'))


// app.listen(3000, handleListen);

//http 와 ws 서버를 모두 사용하기 위한 작업
const server = http.createServer(app);
const io = Socket(server);

io.on("connection", socket=> {
    socket.on('join_room', (roomName)=> {
        socket.join(roomName);
        socket.to(roomName).emit("welcome")
    })
    socket.on('offer', (offer, roomName) => {
        console.log("offer(초대장)을 받았습니다.")
        socket.to(roomName).emit('offer', offer);
    })
    socket.on('answer', (answer, roomName)=> {
        socket.to(roomName).emit('answer', answer);
    })
    socket.on('ice', (ice, roomName)=> {
        socket.to(roomName).emit('ice', ice)
    })
})


const handleListen = () => console.log(`Listening on http://localhost:${port}`)
server.listen(port, handleListen);
