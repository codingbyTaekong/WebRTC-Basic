import http from "http"
import express from "express";
import  Socket  from "socket.io";

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
const io = Socket(server);

function publicRooms() {
    // const {sids, rooms} = io.sockets.adapter
    // const socketIds = sids;
    // const rooms = rooms;
    const {
        sockets : {
            adapter : {sids, rooms},
        },
    } = io
    const publicRooms = [];
    rooms.forEach((value, key)=> {
        sids.get(key) === undefined ? publicRooms.push(key) : null
    })
    return publicRooms;
}

io.on("connection", socket => {
    socket["nickname"] = "Anon"
    socket.onAny((e)=> {
        console.log(io.sockets.adapter)
        console.log(`Socket Event:${e}`)
    })
    socket.on("enter_room", (roomName, done)=> {
        socket.join(roomName);
        done();
        socket.to(roomName).emit("welcome", socket.nickname);
        // 현재 서버에 등록된 방의 정보를 보냄
        io.sockets.emit("room_change", publicRooms());
    })
    
    // 접속이 완전히 끊기기 전에 발생
    socket.on("disconnecting", ()=> {
        socket.rooms.forEach(room => socket.to(room).emit("bye", socket.nickname))
    })

    // 접속이 완전히 끊기고 나면 발생
    socket.on("disconnect",()=> {
        io.sockets.emit("room_change", publicRooms());
    })

    socket.on("new_message", (msg, room, done)=> {
        socket.to(room).emit("new_message", `${socket.nickname} : ${msg}`);
        done();
    })
    socket.on("nickname", nickname => socket["nickname"] = nickname )
})

server.listen(3000, handleListen);
