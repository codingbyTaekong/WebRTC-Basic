// import http from "http"
// import express from "express";
// // 기본방식
// // import  {Socket}  from "socket.io";
// // admin ui를 사용할 때
// import  Socket  from "socket.io";
// import wrtc from 'wrtc'

const https = require('https');
const express = require('express');
const Socket = require('socket.io');
const wrtc = require('wrtc');
const { createAdapter } = require("@socket.io/cluster-adapter");
const { setupWorker } = require("@socket.io/sticky");
const fs = require('fs');

let port = 3001;
const options = {
    key : fs.readFileSync(__dirname + '/keys/local.pem'),
    cert: fs.readFileSync(__dirname + '/keys/public.pem'),
    // ca: fs.readFileSync(__dirname + '/keys/server.csr')
}
const app = express();
app.set('view engine', 'pug');
app.set('views', __dirname + "/views");
app.use('/public', express.static(__dirname + "/public"))
app.get('/', (req,res)=> res.render('home'))
app.get('/*', (req,res)=> res.redirect('/'))


// app.listen(3000, handleListen);

//http 와 ws 서버를 모두 사용하기 위한 작업
const server = https.createServer(options, app);
const io = Socket(server);
// io.adapter(createAdapter());
// setupWorker(io);

let roomName = "bigchoi"
// 서버와 실제로 P2P로 주고받을 RTC objects
const users = new Map();
// const 
// 다른 유저가 접속하면 클라에서 다른 유저의 갯수만큼 RTC커넥션을 만들겠지.
// 그럼 그만큼 offer가 생길거고, 그렇다는건 하나의 클라이언트마다 모든 유저 - 자기자신만큼의 RTC커넥션을 생성한다는 것이고
// 나중에 연결을 끊거나 하기 위해서는
// 내 id마다 (모든 유저 - 자기자신만큼의 RTC커넥션)을 value로 가지고 있어야된다는 말
// 때문에 실제 서버와 1:1로 접속되어 있는 object가 아닌 다른 유저들과의 커넥션을 관리할 object가 하나 더 필요하다는 얘기
const connectionsExceptMe = new Map();

const iceConfig = {
    iceServers : [
        {
            urls : [
                "stun:stun.l.google.com:19302",
                "stun:stun1.l.google.com:19302",
                "stun:stun2.l.google.com:19302",
                "stun:stun3.l.google.com:19302",
                "stun:stun4.l.google.com:19302"
            ]
        }
    ]
}

io.on("connection", socket=> {
    socket.emit('mySocketID', socket.id);
    socket.join('bigchoi');
    socket.on('join_room', async (data)=> {
        try {
            // 새로운 유저가 들어오면 커넥션을 연결하고, 
            const newConnection = new wrtc.RTCPeerConnection(iceConfig);
            // user map에 새로 생성한 커넥션을 등록한다.
            users.set(socket.id, {conn : newConnection, nickname : data.nickname});
            // 온트랙 이벤트 등록
            newConnection.ontrack = async (e) => {
                users.get(socket.id).stream = e.streams[0]
                // await newConnection.addTrack()
            }
            // 목적지 설정?
            const desc = new wrtc.RTCSessionDescription(data.sdp);
            // 받은 offer를 setRemoteDescription에 등록한다.(초대장이니까..)
            await newConnection.setRemoteDescription(desc);
            // 그 다음에 해당 커넥션에 answer를 생성 후에
            const answer = await newConnection.createAnswer({
                offerToReceiveAudio: true,
                offerToReceiveVideo: true,
            });
            // 연결된 커넥션에 setLocalDescription(answer) 한다.
            await newConnection.setLocalDescription(answer);

            // console.log(users.get(socket.id))
            newConnection.addEventListener('connectionstatechange' , (e)=> {
                // console.log(e.connectionState)
                if (newConnection.connectionState === "connected") {
                    console.log("연결되었습니다!")
                }
            })
            newConnection.addEventListener('icecandidate', (e)=> {
                // console.log("icecandidate이벤트가 발생되었습니다.")
                if (e.candidate) {
                    socket.emit('returnIce', e.candidate)
                }
            })

            socket.emit('payload', answer);

            // socket.to(roomName).emit("welcome", nickname)
            // 내가 아닌 다른 유저들 배열
            const otherUsers = [];
            for(const [key, value] of users ) {
                console.log(socket.id, key)
                if (socket.id !== key) {
                    let otherUser = {
                        id : key,
                        nickname : value.nickname
                    }
                    otherUsers.push(otherUser);
                }
            }
            
            if (otherUsers.length > 0) {
                console.log('다른 유저들',otherUsers.length)
                // 내 자신에게 내가 아닌 다른 유저의 리스트를 보내준다.
                socket.emit('otherUsers', otherUsers);
            }
            try {
                // 내가 아닌 다른 사람들에게 내가 들어왔다고 알려야함.(이미 들어와있는 유저들에게)
                socket.broadcast.to('bigchoi').emit('newClient', {
                    id : socket.id,
                    nickname : data.nickname
                });
            } catch (error) {
                // console.log("왜 안 보내지니")
            }
        } catch (error) {
            console.log(error)
        }
    })

    // 클라이언트와 1:1 연결에서 쓰이는 ice 이벤트
    socket.on('ice', async (ice, roomName)=> {
        try {
            if (users.has(socket.id)) {
                await users.get(socket.id).conn.addIceCandidate(ice)
                console.log("iceCandidate를 add했습니다.")
            }
        } catch (error) {
            // console.log(error)
        }
    })



    // 새로운 유저가 들어오면 아직 새로들어온 유저와 연결이 되어있지 않으니까
    // 다시 연결을 수립해야된다.
    socket.on('otherUserOffer', async (data)=> {
        // return console.log(data)
        // 새로운 offer(내가 아닌 다른 유저)를 받으면 새로운 커넥션을 만들고
        const newConnection = new wrtc.RTCPeerConnection(iceConfig);
        users.get(data.mySocketID).stream.getTracks().forEach(track => {
            newConnection.addTrack(track, users.get(data.mySocketID).stream)
        })
        // 중복체크를 해야된다.
        if (connectionsExceptMe.has(data.mySocketID)) {
            // 만약에 있으면
            const connections = connectionsExceptMe.get(data.mySocketID).connections;
            console.log(connections)
            connections.map(obj => obj.id !== data.id ? connections.push({id : data.id, conn : newConnection}) : null)
        } else {
            // 없으면 conntions 배열에 초기값을 추가한다.
            connectionsExceptMe.set(data.mySocketID, {connections : [{
                id : data.id,
                conn : newConnection
            }]})
        }
        newConnection.addEventListener('icecandidate', (e)=> {
            // 새로운 유저가 입장해서 발생되는 icecandidate이벤트
            if (e.candidate) {
                console.log('새로운 유저가 입장해서 발생되는 icecandidate이벤트 발생!')
                io.to(data.mySocketID).emit('newClientIce', {
                    mySocketID : data.mySocketID,
                    id : data.id,
                    candidate : e.candidate
                })
            }
        })
        newConnection.addEventListener('connectionstatechange' , (e)=> {
            // console.log(e.connectionState)
            if (newConnection.connectionState === "connected") {
                console.log(`${data.id}와 연결되었습니다!`)
            }
        })
        // return console.log(connectionsExceptMe.get(data.mySocketID).connections)
        // const desc = await new wrtc.RTCSessionDescription(data.offer);
        // return console.log(data.offer);
        await newConnection.setRemoteDescription(data.offer);
        const answer = await newConnection.createAnswer({
            offerToReceiveAudio: false,
            offerToReceiveVideo: false,
        })
        await newConnection.setLocalDescription(answer);
        console.log(data.mySocketID)
        io.to(data.mySocketID).emit('newClientAnswer', {
            mySocketID : data.mySocketID,
            id : data.id,
            answer : answer
        })
    })

    socket.on('otherUsersIce', (data)=> {
        const connections = connectionsExceptMe.get(data.mySocketID).connections;
        connections.map(obj => obj.id === data.id ? obj.conn.addIceCandidate(data.candidate) : null)
    })

    socket.on('disconnecting', ()=> {
        // socket.id 연결 해제 및 map에서 삭제
    })
    socket.on('disconnect', ()=> {
        try {
            if (users.has(socket.id)) {
                users.get(socket.id).conn.close();
                io.to(roomName).emit('outuser', socket.id);
                users.delete(socket.id)
            }
        } catch (error) {
            // console.log(error)
        }
        // socket.id가 속해있는 방에 나간 소식을 전달
    })
})


const handleListen = () => console.log(`Listening on http://localhost:${port}`)
server.listen(port, handleListen);
