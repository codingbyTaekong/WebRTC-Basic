const socket = io();
const myFace = document.querySelector('#myFace');
const muteBtn = document.querySelector("#mute");
// const cameraBtn = document.querySelector('#camera');
const camerasSelect = document.querySelector('#cameras');
// stream 은 비디오와 오디오가 결합된 것

const call = document.querySelector('#call');

call.hidden = true;

let myStream;
let muted = false;
let cameraOff = false;
let roomName;
let myNickname;
let myPeerConnection;
let mySocketID;
let users = new Map();

async function getCameras() {
    try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const audios = devices.filter(device=> device.kind === 'audioinput');
        const currentAudio = myStream.getAudioTracks()[0];
        audios.map(audio => {
            console.log(currentAudio)
            console.log(audio)
            console.log(audio.deviceId)
            console.log(audio.label)
            const option = document.createElement('option');
            option.value = camera.deviceId;
            option.innerText = camera.label;
            if (currentCamera.label === camera.label) {
                option.selected = true;
            }
            camerasSelect.appendChild(option);
        })
    } catch (error) {
        console.log(error);
    }
}

async function getAudios() {
    try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const audios = devices.filter(device=> device.kind === 'videoinput');
        const currentAudio = myStream.getAudioTracks()[0];
        audios.map(audio => {
            const option = document.createElement('option');
            option.value = audio.deviceId;
            console.log(audio.label)
            option.innerText = audio.label;
            if (currentAudio.label === audio.label) {
                option.selected = true;
            }
            camerasSelect.appendChild(option);
        })
    } catch (error) {
        console.log(error);
    }
}


async function getMedia(deviceId) {
    const initialConstrains = {
        audio : true,
        video : false
    }
    const cameraConstrains = {
        audio : true,
        video : false

    }
    try {
        myStream = await navigator.mediaDevices.getUserMedia(
            deviceId ? cameraConstrains : initialConstrains
        );
        // myFace.srcObject = myStream;
        if (!deviceId) {
            await getAudios();
        };
    }
    catch (e) {
        console.log(e);
    }
}


// 음성 온오프

function handleMuteClick() {
    if (myStream) {
        myStream.getAudioTracks().forEach(track=>track.enabled =!track.enabled);
        if (!muted) {
            muteBtn.innerHTML = 'Unmute';
            muted = true;
        } else {
            muteBtn.innerHTML = 'Mute';
            muted = false;
        }
    }
}

// 카메라 온오프
function handlecameraClick() {
    myStream.getVideoTracks().forEach(track=>track.enabled =!track.enabled);
    // if (cameraOff) {
        // cameraBtn.innerText = "Turn Camera Off";
        // cameraOff = false;
    // } else {
        cameraBtn.innerText = "Turn Camera On";
        cameraOff = true;
    // }
}


async function handleCameraChange() {
    // getMedia => 나의 미디어 트랙을 찾는 함수
    await getMedia(camerasSelect.value);
    console.log(camerasSelect.value);
    if (myPeerConnection) {

        const audioTrack = myStream.getAudioTracks()[0]
        // videoSender => 말 그대로 비디
        const auduiSender = myPeerConnection.getSenders().find(sender => sender.track.kind === "audio");

        auduiSender.replaceTrack(audioTrack)
    }
}
muteBtn.addEventListener("click", handleMuteClick);
// cameraBtn.addEventListener("click", handlecameraClick);
camerasSelect.addEventListener('input', handleCameraChange);



// 웰컴 관련 함수
const welcome = document.querySelector('#welcome')
const welcomeForm = welcome.querySelector('form');


async function initCall() {
    welcome.hidden = true;
    call.hidden = false;
    await getMedia();
    // RTC 연결
    return await makeConnection();
}

// RTC code
// 연결을 만드는 함수
function makeConnection() {
    myPeerConnection = new RTCPeerConnection({
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
    });
    users.set(mySocketID, {conn : myPeerConnection, nickname : ''});
    myPeerConnection.addEventListener('icecandidate', handleIce);
    myPeerConnection.addEventListener('addstream', handleAddStream);
    myPeerConnection.addEventListener('connectionstatechange', event => {
        if (myPeerConnection.connectionState === 'connected') {
            // Peers connected!
            console.log("연결되었습니다!")
        };
    });
    
    // addStream === addTrack 같은 함수
    // 내 스트림에 있는 트랙들을 불러와서 피어 커넥션에 스트림을 추가한다.
    if( myStream !== undefined ) {
        myStream.getTracks().forEach(track => myPeerConnection.addTrack(track, myStream))

        // myStream.getTracks().forEach(track => {
        //     const myAudio = new Audio();
        //     myAudio.srcObject = track
        // })
    }
    return myPeerConnection;
}

async function otherUserConnection(user, mySocketID) {
    const newConnection = new RTCPeerConnection({
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
    });
    users.set(user.id, {conn: newConnection, nickname : user.nickname});
    newConnection.addEventListener('icecandidate', (e)=> {
        // 새로운 유저가 입장해서 발생되는 icecandidate이벤트
        if (e.candidate) {
            console.log('새로운 유저가 입장해서 발생되는 icecandidate이벤트 발생!')
            socket.emit('otherUsersIce', {
                mySocketID : mySocketID,
                id : user.id,
                candidate : e.candidate
            })
        }
    })
    newConnection.addEventListener('connectionstatechange' , (e)=> {
        // console.log(e.connectionState)
        if (newConnection.connectionState === "connected") {
            console.log(`${user.id}와 연결되었습니다!`)
        }
    })
    newConnection.ontrack = (e)=> {
        console.log("데이터가 들어왔나요?")
        console.log(e.streams)
        const container = document.createElement('div');
        container.classList.add('userStream');
        container.classList.add(user.id);
        const nickname = document.createElement('span');
        nickname.textContent = user.nickname;
        const video = document.createElement('video');
        video.autoplay = true;
        video.playsInline = true;
        video.width = '200';
        video.height = '200';
        container.appendChild(nickname)
        container.appendChild(video)
        document.querySelector('#call').appendChild(container)
        video.srcObject = e.streams[0];
    }
    const offer = await newConnection.createOffer({
        offerToReceiveAudio : true,
        offerToReceiveVideo : false
    })
    await newConnection.setLocalDescription(offer);
    socket.emit('otherUserOffer', {
        mySocketID : mySocketID,
        id : user.id,
        offer : offer
    })
    console.log(`${user.id}와 연결을 위해 RTC커넥션을 수립후 offer를 보냈습니다.`)
}

function handleIce(data) {

    socket.emit('ice', data.candidate, roomName)
    console.log(`iccCandidate를 (${data.candidate}) 서버(${roomName})에 보냈습니다.`);
}

function handleAddStream(data) {
    // 원본코드 {
    // const peerFace = document.querySelector('#peerFace');
    // peerFace.srcObject = data.stream;
    // }
    console.log("어떤 데이터가 들어있나요?")
    console.log(data.stream)
    // const peerFace = document.createElement('video');
    // peerFace.autoplay = true;
    // peerFace.playsInline = true;
    // peerFace.style.width = '400px'
    // peerFace.style.height = '400px'
    // peerFace.srcObject = data.stream;
    // document.querySelector('#call').appendChild(peerFace)
}

// 내가 처음 방에 입장했을 때 발생됨

async function handleWelcomeSubmit (e) {
    e.preventDefault();
    const input = welcomeForm.querySelector('input');
    roomName = 'bigchoi'
    await initCall();
    // 내 닉네임 설정
    users.get(mySocketID).nickname = input.value;
    document.querySelector('.nickname').textContent = input.value;
    console.log(users.get(mySocketID))
    myNickname = input.value;
    // 
    const offer = await myPeerConnection.createOffer()
    await myPeerConnection.setLocalDescription(offer)
    const mydata = {
        sdp : myPeerConnection.localDescription,
        nickname : myNickname
    }
    socket.emit("join_room", mydata);
    input.value = '';

}
welcomeForm.addEventListener('submit', handleWelcomeSubmit);


// socket code
// 나와 서버의 연결에서 발생되는 answer이벤트

// peer A 브라우저에서 실행(먼저들어온 유저) 이미 들어와있는 유저에게만 실행됨
socket.on('welcome', async ()=> {
    console.log("누군가 입장했습니다.")
})

socket.on('payload', (answer)=> {
    console.log('payload 이벤트 발생')
    // console.log(answer)
    myPeerConnection.setRemoteDescription(answer).catch(e=>console.log(e))
})

socket.on('returnIce', async (ice) => {
    console.log("ice를 받았습니다.")
    await myPeerConnection.addIceCandidate(ice);
    // console.log(myPeerConnection.iceConnectionState)
})

socket.on('newClient',  async (newClient)=> {
    console.log("새로운 유저가 입장했습니다")
    // 새로운 유저가 들어오면 RTC커넥션을 생성한 뒤에 offer를 보낸다.
    otherUserConnection(newClient, mySocketID);
})

socket.on('newClientAnswer', async (data)=> {
    // 새로운 클라이언트의 answer를 받았습니다.
    console.log('새로운 클라이언트의 answer를 받았습니다.')
    users.get(data.id).conn.setRemoteDescription(data.answer);
})

socket.on('newClientIce', (data)=> {
    console.log("새로운 클라이언트의 RTC커넥션에서 ice 이벤트가 발생했습니다!");
    users.get(data.id).conn.addIceCandidate(data.candidate);
})


socket.on('mySocketID', (id)=> {
    mySocketID = id;
})


socket.on('otherUsers', (otherUsers)=> {
    console.log("내가 아닌 다른 유저의 데이터를 받았습니다")
    console.log(otherUsers)
    otherUsers.map(user => otherUserConnection(user, mySocketID))
})

socket.on('outuser', (id)=> {
    if (users.has(id)) {
        users.get(id).conn.close();
        document.querySelector(`.${id}`).remove()
        users.delete(id);
    }
})