
const socket = io();

const myFace = document.querySelector('#myFace');
const muteBtn = document.querySelector("#mute")
const cameraBtn = document.querySelector('#camera')
const camerasSelect = document.querySelector('#cameras')
// stream 은 비디오와 오디오가 결합된 것

const call = document.querySelector('#call')

call.hidden = true;

let myStream;
let muted = false;
let cameraOff = false;
let roomName;
let myPeerConnection;

async function getCameras() {
    try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cameras = devices.filter(device=> device.kind === 'videoinput');
        const currentCamera = myStream.getVideoTracks()[0];
        cameras.map(camera => {
            const option = document.createElement('option');
            option.value = camera.deviceId;
            option.innerText = camera.label
            if (currentCamera.label === camera.label) {
                option.selected = true;
            }
            camerasSelect.appendChild(option)
        })
    } catch (error) {
        console.log(error)
    }
}

async function getMedia(deviceId) {
    const initialConstrains = {
        audio : true,
        video : { facingMode : 'user' },
        // video : false
    }
    const cameraConstrains = {
        audio : true,
        video : { deviceId : { exact : deviceId } }
    }
    try {
        myStream = await navigator.mediaDevices.getUserMedia(
            deviceId ? cameraConstrains : initialConstrains
        )
        myFace.srcObject = myStream
        if (!deviceId) {
            await getCameras();
        }
    }
    catch (e) {
        console.log(e)
    }
}

function handleMuteClick() {
    // console.log(myStream.getAudioTracks());
    myStream.getAudioTracks().forEach(track=>track.enabled =!track.enabled);
    if (!muted) {
        muteBtn.innerHTML = 'Unmute';
        muted = true;
    } else {
        muteBtn.innerHTML = 'Mute';
        muted = false;
    }
}
function handlecameraClick() {
    myStream.getVideoTracks().forEach(track=>track.enabled =!track.enabled);
    if (cameraOff) {
        cameraBtn.innerText = "Turn Camera Off";
        cameraOff = false;
    } else {
        cameraBtn.innerText = "Turn Camera On";
        cameraOff = true;
    }
}
async function handleCameraChange() {
    // getMedia => 나의 미디어 트랙을 찾는 함수
    await getMedia(camerasSelect.value);
    console.log(camerasSelect.value);
    if (myPeerConnection) {

        const videoTrack = myStream.getVideoTracks()[0]
        // videoSender => 말 그대로 비디
        const videoSender = myPeerConnection.getSenders().find(sender => sender.track.kind === "video");
        console.log(videoSender)

        videoSender.replaceTrack(videoTrack)
    }
}
muteBtn.addEventListener("click", handleMuteClick);
cameraBtn.addEventListener("click", handlecameraClick);
camerasSelect.addEventListener('input', handleCameraChange);



// 웰컴 관련 함수
const welcome = document.querySelector('#welcome')
const welcomeForm = welcome.querySelector('form');

async function initCall() {
    welcome.hidden = true;
    call.hidden = false;
    await getMedia();
    // RTC 연결
    makeConnection();
}

async function handleWelcomeSubmit (e) {
    e.preventDefault();
    const input = welcomeForm.querySelector('input');
    await initCall()
    socket.emit("join_room",input.value);
    roomName = input.value;
    input.value = '';
}
welcomeForm.addEventListener('submit', handleWelcomeSubmit);



// socket code
// peer A 브라우저에서 실행(먼저들어온 유저)
socket.on('welcome', async ()=> {
    console.log("someone joined")
    const offer = await myPeerConnection.createOffer();
    myPeerConnection.setLocalDescription(offer)
    socket.emit("offer", offer, roomName)
})

// peer B 브라우저에서 실행(나중에 들어온 유저)
socket.on('offer', async (offer)=> {
    // console.log(offer)
    myPeerConnection.setRemoteDescription(offer)
    const answer = await myPeerConnection.createAnswer();
    myPeerConnection.setLocalDescription(answer);
    socket.emit('answer', answer, roomName);
})

// peer A 브라우저에서 실행(먼저들어온 유저)
socket.on('answer', answer => {
    myPeerConnection.setRemoteDescription(answer)
})

socket.on('ice', ice => {
    myPeerConnection.addIceCandidate(ice);
})

// RTC code
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
    myPeerConnection.addEventListener('icecandidate', handleIce)
    myPeerConnection.addEventListener('addstream', handleAddStream)
    
    // addStream === addTrack 같은 함수
    myStream.getTracks().forEach(track=>myPeerConnection.addTrack(track, myStream))
}

function handleIce(data) {
    socket.emit('ice', data.candidate, roomName)
    console.log("got icecandidate");
    console.log(data)
}

function handleAddStream(data) {
    // 원본코드 {
    // const peerFace = document.querySelector('#peerFace');
    // peerFace.srcObject = data.stream;
    // }
    const peerFace = document.createElement('video');
    peerFace.autoplay = true;
    peerFace.playsInline = true;
    peerFace.style.width = '400px'
    peerFace.style.height = '400px'
    peerFace.srcObject = data.stream;
    document.querySelector('#call').appendChild(peerFace)
    console.log('got an event from my peer');
    console.log(data)
}